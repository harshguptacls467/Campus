"use client";

import React from "react";
import { useCampusStore } from "@/store/useCampusStore";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function Toast() {
  const { toastMessage } = useCampusStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-bounce-short">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-950 text-white shadow-2xl border border-zinc-700/80 backdrop-blur-xl">
        <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <p className="text-xs font-medium text-zinc-200 leading-snug">
          {toastMessage}
        </p>
      </div>
    </div>
  );
}
