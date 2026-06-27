"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-ink shadow-sm ring-1 ring-slate-200"
    >
      <Printer className="mr-2 inline" size={17} />
      Print / save PDF
    </button>
  );
}
