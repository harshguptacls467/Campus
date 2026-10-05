"use client";

import React, { useState } from "react";
import { Sparkles, Send, MessageSquare, Bot, CornerDownLeft, Languages } from "lucide-react";
import { DetailedNoticeData } from "@/lib/mock/notices";

interface AskAboutNoticeBarProps {
  notice: DetailedNoticeData;
  onTriggerCalendarModal?: () => void;
}

export default function AskAboutNoticeBar({
  notice,
  onTriggerCalendarModal,
}: AskAboutNoticeBarProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "copilot"; text: string; lang?: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    { text: "Who is eligible?", key: "eligible" },
    { text: "What documents do I need?", key: "docs" },
    { text: "What happens if I miss the deadline?", key: "miss" },
    { text: "Add the deadline to my calendar", key: "cal" },
    { text: "Is notice ka matlab kya hai?", key: "hinglish_summary" },
  ];

  const handleAsk = (userText: string) => {
    if (!userText.trim()) return;

    // Check if calendar request
    if (
      userText.toLowerCase().includes("calendar") ||
      userText.toLowerCase().includes("remind")
    ) {
      if (onTriggerCalendarModal) {
        onTriggerCalendarModal();
      }
    }

    const newMsgs = [...messages, { role: "user" as const, text: userText }];
    setMessages(newMsgs);
    setQuery("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      const lower = userText.toLowerCase();

      // Hinglish / Hindi detection
      const isHindiOrHinglish =
        lower.includes("matlab") ||
        lower.includes("kya hai") ||
        lower.includes("kaise") ||
        lower.includes("hindi") ||
        lower.includes("batao") ||
        lower.includes("bharo");

      if (lower.includes("who is eligible") || (isHindiOrHinglish && lower.includes("eligible"))) {
        reply = isHindiOrHinglish
          ? "Ye notice 5th semester ke regular B.Tech students (CSE, AIML, DS, IT, ECE) ke liye hai jinki attendance 75% se upar hai."
          : `All regular students of B.Tech 5th Semester in ${notice.branches.join(", ")} with minimum 75% attendance are eligible. Your profile matches!`;
      } else if (lower.includes("document") || lower.includes("kya chahiye")) {
        reply = isHindiOrHinglish
          ? "Aapko Student ID card, Enrollment number (22CSE084), aur current semester fee receipt upload karni hogi."
          : `Required documents: ${notice.requiredDocuments.join(", ")}. Fee receipt is mandatory.`;
      } else if (
        lower.includes("miss") ||
        lower.includes("late") ||
        lower.includes("fine") ||
        lower.includes("baad")
      ) {
        reply = isHindiOrHinglish
          ? "Agar 11 October ke baad submit kiya to ₹500 late fine lagega (15 October tak). Uske baad portal bilkul band ho jayega."
          : "11 October 11:59 PM is the strict cutoff. Submitting between 12-15 Oct incurs a ₹500 late fee penalty. No forms accepted afterward.";
      } else if (lower.includes("calendar")) {
        reply =
          "Opened calendar confirmation modal. Never silently creating events — choose reminder alert (1 day before, 3 hours before, or both).";
      } else if (isHindiOrHinglish) {
        reply =
          "Is notice ka main point ye hai ki 5th sem students ko odd-sem exam form 11 October 11:59 PM tak bina late fee ke submit karna hai. Uske baad ₹500 fine lagega. Aap 5th Sem CSE me ho, isliye aapko form bharna zaroori hai.";
      } else {
        reply = `Grounded directly in Circular ${notice.officialRef}: ${notice.inShortSummary}`;
      }

      setMessages((prev) => [
        ...prev,
        { role: "copilot", text: reply, lang: isHindiOrHinglish ? "Hinglish" : "English" },
      ]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-md p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <Bot className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-extrabold text-zinc-950">
            Ask Copilot About This Notice
          </h4>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
          <Languages className="w-3 h-3 text-indigo-600" />
          <span>English &amp; Hinglish Enabled</span>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(q.text)}
            className="text-[11px] px-3 py-1 rounded-full bg-zinc-50 hover:bg-indigo-50 hover:text-indigo-900 border border-zinc-200 hover:border-indigo-300 text-zinc-700 transition-all font-medium"
          >
            {q.text}
          </button>
        ))}
      </div>

      {/* Conversational Stream (if any queries asked) */}
      {messages.length > 0 && (
        <div className="space-y-2.5 max-h-64 overflow-y-auto p-3 rounded-2xl bg-zinc-50/80 border border-zinc-200 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl max-w-[85%] ${
                m.role === "user"
                  ? "ml-auto bg-indigo-600 text-white font-medium shadow-sm"
                  : "mr-auto bg-white border border-zinc-200/90 text-zinc-800 shadow-sm"
              }`}
            >
              {m.role === "copilot" && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-700 font-bold mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Grounding: {notice.officialRef}</span>
                  {m.lang && (
                    <span className="bg-indigo-50 px-1.5 py-0.2 rounded text-[9px]">
                      {m.lang}
                    </span>
                  )}
                </div>
              )}
              <p className="leading-relaxed">{m.text}</p>
            </div>
          ))}

          {isTyping && (
            <div className="p-3 rounded-2xl bg-white border border-zinc-200 text-zinc-500 text-xs flex items-center gap-2 max-w-[120px]">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>Grounded OCR...</span>
            </div>
          )}
        </div>
      )}

      {/* Input Form */}
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
          placeholder="Ask anything about this notice... (e.g. 'Is notice ka matlab kya hai?')"
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
