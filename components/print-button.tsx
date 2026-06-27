"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2.5 rounded-2xl bg-leaf px-6 py-3 text-sm font-bold text-white shadow-lg shadow-leaf/25 transition-all hover:bg-leaf/90 hover:shadow-xl active:scale-95"
    >
      <Printer size={18} />
      Print / Save PDF
    </button>
  );
}
