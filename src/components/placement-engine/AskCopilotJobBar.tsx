"use client";

import React, { useState } from "react";
import { DetailedPlacementOpportunity } from "@/lib/mock/placements";
import {
  Sparkles,
  Send,
  Bot,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";

interface AskCopilotJobBarProps {
  opportunity: DetailedPlacementOpportunity;
}

export default function AskCopilotJobBar({ opportunity }: AskCopilotJobBarProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "copilot"; text: string; data?: any }[]>(
    []
  );
  const [isTyping, setIsTyping] = useState(false);
  const [showPrepSprint, setShowPrepSprint] = useState(false);

  const chips = [
    "What should I prepare?",
    "Why am I eligible?",
    "What skills am I missing?",
    "Summarize this placement notice",
    "Create a preparation plan",
  ];

  const handleAsk = (userText: string) => {
    if (!userText.trim()) return;

    const newMsgs = [...messages, { role: "user" as const, text: userText }];
    setMessages(newMsgs);
    setQuery("");
    setIsTyping(true);

    const lower = userText.toLowerCase();

    setTimeout(() => {
      let reply = "";
      let hasPrep = false;

      if (lower.includes("prepare") || lower.includes("plan") || lower.includes("schedule")) {
        reply = `Here is your targeted 4-priority preparation plan and 7-day sprint for ${opportunity.company}:`;
        hasPrep = true;
        setShowPrepSprint(true);
      } else if (lower.includes("why am i eligible") || lower.includes("eligible")) {
        reply = `You satisfy all mandatory filters: Branch (${opportunity.requirements[0].studentValue}), CGPA (${opportunity.requirements[1].studentValue}), 0 backlogs, and graduation year 2027.`;
      } else if (lower.includes("skill") || lower.includes("missing")) {
        reply = opportunity.skillGap
          ? `You meet all official gates! ${opportunity.skillGap.skillName} is mentioned in preferred skills and will give you a competitive edge in technical interview rounds.`
          : "You have verified coursework in all required foundational competencies.";
      } else if (lower.includes("summarize") || lower.includes("notice")) {
        reply = `${opportunity.company} (${opportunity.role}). Package: ${opportunity.packageText}. Cutoff: ${opportunity.requirements[1].required}. Application closes ${opportunity.deadlineText}.`;
      } else {
        reply = `Grounded directly in ${opportunity.sourceDocument.filename}: ${opportunity.summaryText}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "copilot",
          text: reply,
          data: hasPrep ? opportunity.preparationPlan : undefined,
        },
      ]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm p-6 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
              GROUNDED COPILOT REASONING
            </span>
            <h4 className="text-sm font-extrabold text-zinc-950">
              Ask about this opportunity
            </h4>
          </div>
        </div>

        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
          Source: {opportunity.company} Circular
        </span>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {chips.map((ch, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(ch)}
            className="text-[11px] px-3 py-1 rounded-full bg-zinc-50 hover:bg-indigo-50 hover:text-indigo-900 border border-zinc-200 hover:border-indigo-300 text-zinc-700 transition-all font-medium"
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto p-3 rounded-2xl bg-zinc-50/80 border border-zinc-200 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl max-w-[90%] ${
                m.role === "user"
                  ? "ml-auto bg-indigo-600 text-white font-medium shadow-xs"
                  : "mr-auto bg-white border border-zinc-200 text-zinc-800 shadow-xs space-y-3"
              }`}
            >
              {m.role === "copilot" && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-700 font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Verified Placement Intelligence</span>
                </div>
              )}
              <p className="leading-relaxed">{m.text}</p>

              {/* 16. Preparation Mode: Priorities + 7-Day Sprint Plan */}
              {m.data && (
                <div className="mt-3 pt-3 border-t border-zinc-100 space-y-4 text-xs font-sans">
                  
                  {/* 4 Priorities */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-black tracking-wider text-indigo-950 block">
                      {m.data.company.toUpperCase()} PREPARATION PLAN — 4 PRIORITIES
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.data.priorities.map((p: any) => (
                        <div
                          key={p.priority}
                          className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-0.5"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="font-extrabold text-indigo-700">
                              Priority {p.priority}
                            </span>
                            <span className="font-bold text-zinc-900">{p.topic}</span>
                          </div>
                          <p className="text-[10px] text-zinc-600 leading-tight">{p.why}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7-Day Sprint Plan */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-black tracking-wider text-zinc-700 block">
                      7-DAY ACTIONABLE PREPARATION SPRINT
                    </span>

                    <div className="space-y-1.5 text-[11px] font-mono">
                      {m.data.sevenDaySchedule.map((s: any, sIdx: number) => (
                        <div
                          key={sIdx}
                          className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-2"
                        >
                          <span className="font-bold text-indigo-900 w-16 shrink-0">{s.day}</span>
                          <span className="text-zinc-700 truncate font-sans text-xs">{s.focus}</span>
                          <span className="text-[10px] text-zinc-500 bg-white px-1.5 py-0.5 rounded border shrink-0">
                            {s.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="p-3 rounded-2xl bg-white border border-zinc-200 text-zinc-500 text-xs flex items-center gap-2 max-w-[140px]">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Grounded reasoning...</span>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about this placement... (e.g. 'What should I prepare for TCS?')"
          className="w-full pl-4 pr-12 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="absolute right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white transition-colors"
          title="Send Question"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
