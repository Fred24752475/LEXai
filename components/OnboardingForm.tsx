"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "./Spinner";

type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "granted";
      latitude: number;
      longitude: number;
      accuracy: number;
    }
  | { status: "denied"; message: string }
  | { status: "unavailable"; message: string };

export function OnboardingForm({ userId, email }: { userId: string; email?: string | null }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [role, setRole] = useState("Founder");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function requestLocation() {
    setError(null);

    if (!("geolocation" in navigator)) {
      setLocation({
        status: "unavailable",
        message: "Location is not available in this browser."
      });
      return;
    }

    setLocation({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          status: "granted",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (geoError) => {
        setLocation({
          status: "denied",
          message:
            geoError.code === geoError.PERMISSION_DENIED
              ? "Location permission was denied. You can still save your profile, but nearby office links will be less accurate."
              : "We could not get your location. Try again or continue without it."
        });
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const locationPayload =
      location.status === "granted"
        ? {
            location_lat: location.latitude,
            location_lng: location.longitude,
            location_accuracy_m: location.accuracy,
            location_captured_at: new Date().toISOString(),
            location_permission: "granted"
          }
        : {
            location_lat: null,
            location_lng: null,
            location_accuracy_m: null,
            location_captured_at: null,
            location_permission:
              location.status === "denied" || location.status === "unavailable"
                ? location.status
                : "not_requested"
          };

    const { error: saveError } = await supabase.from("user_profiles").upsert(
      {
        user_id: userId,
        full_name: fullName || email || null,
        date_of_birth: dateOfBirth,
        role,
        phone: phone || null,
        ...locationPayload
      },
      { onConflict: "user_id" }
    );

    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    router.push("/offices");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card animate-scale-in p-7 sm:p-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          Profile setup
        </p>
        <h1 className="mt-2 text-2xl font-bold text-ink-900">
          Help LexGH personalize your compliance path
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink-500">
          We save this only to your Supabase profile. Location is requested by your browser and
          used to open nearby Ghana compliance offices in Google Maps.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="label">Full name</span>
          <input
            className="input"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your name"
          />
        </label>
        <label>
          <span className="label">Date of birth</span>
          <input
            required
            className="input"
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
          />
        </label>
        <label>
          <span className="label">Role</span>
          <select className="input" value={role} onChange={(event) => setRole(event.target.value)}>
            <option>Founder</option>
            <option>Co-founder</option>
            <option>SME owner</option>
            <option>Manager</option>
            <option>Advisor</option>
          </select>
        </label>
        <label>
          <span className="label">Phone number</span>
          <input
            className="input"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+233..."
          />
        </label>
      </div>

      <section className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-ink-900">Location permission</h2>
            <p className="mt-1 text-sm text-ink-500">
              Turn this on once so Google Maps can show nearby ORC, GRA, SSNIT and Assembly offices.
            </p>
          </div>
          <button
            type="button"
            onClick={requestLocation}
            disabled={location.status === "loading"}
            className="btn-secondary shrink-0"
          >
            {location.status === "loading" ? <Spinner className="h-4 w-4" /> : null}
            Enable location
          </button>
        </div>
        <p className="mt-3 text-sm font-medium text-ink-600">
          {location.status === "granted"
            ? `Location captured (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`
            : location.status === "denied" || location.status === "unavailable"
              ? location.message
              : "Location not captured yet."}
        </p>
      </section>

      {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink-400">
          You can continue even if location is denied, but Maps results will be generic.
        </p>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Spinner className="h-4 w-4" /> : null}
          Save profile and find offices
        </button>
      </div>
    </form>
  );
}
