"use client";

import { useEffect, useState } from "react";

export function AnimatedDemo() {
  // 0: Idle/Start, 1: Typing name, 2: Searching, 3: Result
  const [step, setStep] = useState(0);
  const [typedName, setTypedName] = useState("");

  const targetName = "Adwoa Foods Ltd";

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (step === 0) {
      setTypedName("");
      timeout = setTimeout(() => setStep(1), 1500);
    } else if (step === 1) {
      if (typedName.length < targetName.length) {
        timeout = setTimeout(() => {
          setTypedName(targetName.slice(0, typedName.length + 1));
        }, 80);
      } else {
        timeout = setTimeout(() => setStep(2), 800);
      }
    } else if (step === 2) {
      timeout = setTimeout(() => setStep(3), 2500);
    } else if (step === 3) {
      timeout = setTimeout(() => setStep(0), 4000);
    }

    return () => clearTimeout(timeout);
  }, [step, typedName]);

  const cursorPositionClass =
    step <= 1
      ? "left-[38%] top-[56%]"
      : step === 2
        ? "left-[47%] top-[47%]"
        : "left-[73%] top-[76%]";

  return (
    <div className="relative -mx-5 animate-fade-up sm:-mx-8 lg:-mx-16 xl:-mx-24" style={{ animationDelay: "200ms" }}>
      {/* Outer subtle glow/border to simulate the desktop environment */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-brand-50/90 p-2 shadow-[0_26px_80px_rgba(15,23,42,0.2),0_2px_0_rgba(255,255,255,0.95)_inset,0_-1px_0_rgba(15,23,42,0.12)_inset,0_0_0_1px_rgba(255,255,255,0.65)] backdrop-blur-xl sm:p-5">
        <div className="pointer-events-none absolute inset-0 rounded-[2rem]">
          <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/70" />
          <div className="absolute inset-[1.5px] rounded-[1.9rem] border border-slate-200/45" />
          <div className="absolute inset-[1.5px] rounded-[1.9rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_-1px_0_rgba(15,23,42,0.16)]" />
        </div>
        {/* Inner Browser/App Window */}
        <div className="relative h-[540px] overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.12),0_1px_0_rgba(255,255,255,0.85)_inset] sm:h-[620px]">
          <div
            className={`pointer-events-none absolute z-30 transition-all duration-700 ease-out ${cursorPositionClass}`}
            aria-hidden="true"
          >
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-full bg-black/7 blur-sm" />
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                className="relative drop-shadow-[0_3px_6px_rgba(15,23,42,0.24)]"
              >
                <path
                  d="M5 3.5 18.5 14.5 12.5 15.2 15.8 22.8 12.9 24 9.5 16.4 5.1 20.4 5 3.5Z"
                  fill="white"
                  stroke="#0f172a"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          
          {/* Header Bar */}
          <div className="flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4">
                  {/* Traffic Lights */}
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                  </div>
                  
                  {/* Search Bar */}
                  <div className="hidden sm:flex h-8 w-96 items-center justify-center gap-2 rounded-full bg-slate-50 text-xs font-medium text-slate-400 border border-slate-100">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                    </svg>
                    Search or ask anything...
                  </div>
                  
                  {/* Right Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 items-center rounded-lg bg-brand-50 px-4 text-xs font-bold text-brand-600">
                      Start LexGH
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                      {/* Fake profile avatar */}
                      <div className="h-full w-full bg-gradient-to-tr from-brand-400 to-brand-600 opacity-80" />
                    </div>
                  </div>
                </div>

          {/* Content Area */}
          <div className="relative h-full bg-slate-50/50 p-8 flex flex-col items-center justify-center overflow-hidden">
            
            {/* Step 1 & 2: Form */}
            <div className={`absolute w-full max-w-md transition-all duration-700 ease-in-out ${step <= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 text-center">What is your business called?</h2>
                <div className="mt-6">
                  <div className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm flex items-center transition-all duration-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30">
                    <span className="font-medium">{typedName}</span>
                    <span className="ml-0.5 h-5 w-0.5 animate-pulse bg-brand-500" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <div className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-300 ease-out ${step === 1 && typedName === targetName ? 'bg-gradient-to-b from-brand-400 to-brand-600 shadow-[0_8px_20px_rgba(37,99,235,0.25)] scale-100' : 'bg-slate-300 scale-95'}`}>
                    Continue
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Searching AI State */}
            <div className={`absolute w-full max-w-md transition-all duration-500 ease-in-out ${step === 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
                    <span className="relative flex h-10 w-10">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-60" />
                      <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
                      </span>
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-900">Lex AI is searching the live web...</h3>
                  <div className="mt-4 space-y-3 text-left max-w-xs mx-auto">
                    <div className="flex items-center gap-3">
                       <span className="h-5 w-5 rounded-full bg-brand-600 text-white flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
                       <span className="text-sm font-medium text-slate-900">Checking ORC registration rules</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="h-5 w-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center"><span className="h-2 w-2 animate-pulse rounded-full bg-brand-600" /></span>
                       <span className="text-sm font-medium text-slate-900">Finding latest GRA & SSNIT fees</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Step 4: Result */}
            <div className={`absolute w-full h-full inset-0 bg-white transition-all duration-700 ease-in-out ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
               <div className="p-8">
                 <div className="flex items-start justify-between">
                   <div>
                     <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">Setup Checklist</span>
                     <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">Adwoa Foods Ltd</h2>
                   </div>
                 </div>
                 
                 <div className="mt-8 space-y-4">
                   {/* Mock List Items */}
                   <div className="flex gap-4 p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-brand-400 to-brand-600 text-sm font-bold text-white shadow-sm">1</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Register business name</h3>
                          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">ORC</span>
                        </div>
                        <p className="mt-1.5 text-slate-600 font-medium leading-relaxed">Reserve the name and file as a Company Limited by Shares.</p>
                      </div>
                   </div>
                   <div className="flex gap-4 p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-brand-400 to-brand-600 text-sm font-bold text-white shadow-sm">2</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Obtain TIN</h3>
                          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100">GRA</span>
                        </div>
                        <p className="mt-1.5 text-slate-600 font-medium leading-relaxed">Essential for opening the business bank account.</p>
                      </div>
                   </div>
                 </div>

                 {/* Gradient fade out at bottom */}
                 <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

                 {/* Cluely-style Movable Overlay / Glassmorphic Floating Action Bar */}
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-xl p-1.5 z-10 w-[90%] sm:w-auto max-w-2xl">
                    <button className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm border border-slate-200/60 hover:bg-slate-50 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-slate-800"><path d="M8 5v14l11-7z"/></svg>
                      Resume Session
                    </button>
                    <div className="flex-1 flex items-center px-2 min-w-[200px] sm:min-w-[300px]">
                      <span className="text-sm font-semibold text-slate-400">Ask LexGH about this checklist...</span>
                    </div>
                    <button className="flex shrink-0 h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                    </button>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
