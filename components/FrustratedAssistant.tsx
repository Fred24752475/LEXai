"use client";

import { useMemo, useState } from "react";
import { Spinner } from "./Spinner";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Attachment = {
  name: string;
  type: string;
  size: number;
  textPreview?: string;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

const starterPrompts = [
  "I do not know what documents to take to GRA.",
  "My verification failed. What should I do next?",
  "Help me plan my business registration steps for this week."
];

function readFileContext(file: File): Promise<Attachment> {
  return new Promise((resolve) => {
    const base = {
      name: file.name,
      type: file.type,
      size: file.size
    };

    if (
      file.type.startsWith("text/") ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".csv") ||
      file.name.endsWith(".md")
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          ...base,
          textPreview: String(reader.result || "").slice(0, 3500)
        });
      };
      reader.onerror = () => resolve(base);
      reader.readAsText(file);
      return;
    }

    resolve(base);
  });
}

export function FrustratedAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey, I am LexAI. Tell me what is blocking you and I will help you plan the next step."
    }
  ]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakAnswers, setSpeakAnswers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canListen = useMemo(
    () => typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    []
  );

  function speak(text: string) {
    if (!speakAnswers || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-GH";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setError("Could not hear clearly. Try again or type your message.");
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) setInput((current) => `${current} ${transcript}`.trim());
    };
    recognition.start();
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const selected = Array.from(files).slice(0, 5);
    const contexts = await Promise.all(selected.map(readFileContext));
    setAttachments(contexts);
  }

  async function sendMessage(message = input) {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput("");
    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setLoading(true);

    const response = await fetch("/api/frustrated", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: nextMessages.slice(-10),
        attachments
      })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "LexAI could not respond.");
      return;
    }

    const assistantMessage = { role: "assistant" as const, content: result.answer };
    setMessages((current) => [...current, assistantMessage]);
    speak(result.answer);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="card flex min-h-[620px] flex-col overflow-hidden">
        <div className="border-b border-slate-100 bg-brand-50/70 p-5">
          <span className="badge-authority">LexAI support</span>
          <h1 className="mt-2 text-2xl font-bold text-ink-900">Are you frustrated?</h1>
          <p className="mt-1 text-sm text-ink-600">
            Talk to LexAI, upload documents, use your microphone, and optionally hear answers aloud.
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === "user"
                  ? "ml-auto bg-brand-600 text-white"
                  : "bg-slate-50 text-ink-800 ring-1 ring-inset ring-slate-200"
              }`}
            >
              {message.content}
            </div>
          ))}
          {loading ? (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-ink-600 ring-1 ring-inset ring-slate-200">
              <Spinner className="h-4 w-4" />
              LexAI is thinking...
            </div>
          ) : null}
        </div>

        <div className="border-t border-slate-100 p-4">
          {error ? (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <div className="flex flex-wrap gap-2 pb-3">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-brand-50 hover:text-brand-700"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={2}
              className="input min-h-[52px] resize-none"
              placeholder="Tell LexAI what is frustrating you..."
            />
            <button onClick={() => sendMessage()} disabled={loading} className="btn-primary self-end">
              Send
            </button>
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="card p-5">
          <h2 className="font-bold text-ink-900">Voice and sound</h2>
          <p className="mt-1 text-sm text-ink-500">
            Voice features use the browser microphone and speaker.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startListening}
              disabled={!canListen || listening}
              className="btn-secondary"
            >
              {listening ? "Listening..." : "Use microphone"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSpeakAnswers((value) => !value);
                if (speakAnswers && "speechSynthesis" in window) window.speechSynthesis.cancel();
              }}
              className={speakAnswers ? "btn-primary" : "btn-secondary"}
            >
              {speakAnswers ? "Sound on" : "Sound off"}
            </button>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-ink-900">Upload documents</h2>
          <p className="mt-1 text-sm text-ink-500">
            Add PDFs, images, docs, or text files. Text files are read directly; other files are used as context by name and type.
          </p>
          <label className="mt-4 block cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm font-medium text-ink-600 hover:border-brand-300 hover:bg-brand-50/50">
            Upload files
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt,.csv,.md"
              onChange={(event) => handleFiles(event.target.files)}
              className="hidden"
            />
          </label>
          {attachments.length ? (
            <div className="mt-4 space-y-2">
              {attachments.map((file) => (
                <div key={file.name} className="rounded-lg bg-white px-3 py-2 text-xs ring-1 ring-inset ring-slate-200">
                  <p className="font-semibold text-ink-800">{file.name}</p>
                  <p className="text-ink-500">{Math.round(file.size / 1024)} KB</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-ink-900">What LexAI can do</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-600">
            <li>Plan next steps when a user is stuck.</li>
            <li>Explain failed verification results.</li>
            <li>Prepare document checklists before visiting an agency.</li>
            <li>Turn messy uploaded context into a clear action plan.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
