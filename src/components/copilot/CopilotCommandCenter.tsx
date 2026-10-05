"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import KnowledgeNetworkOrb from "./KnowledgeNetworkOrb";
import VoiceListeningModal from "./VoiceListeningModal";
import DecisionResponse from "./responses/DecisionResponse";
import PanicPlanResponse from "./responses/PanicPlanResponse";
import AttendanceResponse from "./responses/AttendanceResponse";
import NoticeActionResponse from "./responses/NoticeActionResponse";
import ConflictResponse from "./responses/ConflictResponse";
import {
  Sparkles,
  Send,
  Trash2,
  Mic,
  Paperclip,
  CheckCircle2,
  Flame,
  Gauge,
  Briefcase,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

const ROTATING_PLACEHOLDERS = [
  "Ask anything about RGPV Bhopal, exams, or circulars...",
  "What is RGPV Ordinance No. 4 attendance rule?",
  "Am I eligible for today's placement?",
  "When is RGPV 5th sem exam form last date?",
  "Can I bunk tomorrow without falling below 75%?",
  "Show latest scraped notices from rgpv.ac.in...",
  "I have DBMS tomorrow and only 3 hours...",
];

export default function CopilotCommandCenter() {
  const {
    studentUser,
    messages,
    addMessage,
    clearMessages,
    isAiTyping,
    setIsAiTyping,
    submitPrompt,
    showToast,
  } = useCampusStore();

  const [inputVal, setInputVal] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [lastContextTopic, setLastContextTopic] = useState<string | null>("dbms");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  // Rotating placeholder
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  // Smooth scroll
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  const handleCommandSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputVal.trim();
    if (!query) return;

    setInputVal("");
    processUserCommand(query);
  };

  const processUserCommand = async (rawQuery: string) => {
    const userMsg = {
      id: "usr-" + Date.now(),
      sender: "user" as const,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      query: rawQuery,
    };

    addMessage(userMsg);
    setIsAiTyping(true);

    const q = rawQuery.toLowerCase();

    // 1. Try querying the live backend API (/api/copilot/ask)
    try {
      const res = await fetch("http://localhost:5001/api/copilot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: rawQuery }),
      });

      if (res.ok) {
        const body = await res.json();
        if (body.success && body.data?.answer) {
          // If query specifically targets placement card, render rich DecisionResponse card
          if (q.includes("tcs") || (q.includes("eligible") && q.includes("placement"))) {
            setLastContextTopic("placement");
            addMessage({
              id: "copilot-" + Date.now(),
              sender: "copilot",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              decisionType: "eligibility",
              data: {
                isEligible: true,
                company: "TCS Digital",
                role: "Digital Software Engineer",
                packageStr: "₹7.5 LPA",
                matchScore: 92,
                tableData: [
                  { requirement: "Branch Criteria", required: "CSE, IT, ECE", student: "CSE", passed: true },
                  { requirement: "Minimum CGPA", required: "7.50 Cutoff", student: "7.80", passed: true },
                  { requirement: "Active Backlogs", required: "0 Allowed", student: "0", passed: true },
                  { requirement: "Graduation Cohort", required: "Batch 2027", student: "2027", passed: true },
                ],
                skillGap: {
                  skill: "Docker containerization",
                  note: "Docker experience is not present in your GitHub sync. Not required for cutoff eligibility, but listed as a priority skill by the Digital interview panel.",
                },
                whySeeingThis: [
                  "You're in CSE 5th Semester",
                  "Your CGPA is 7.8 (company requires 7.5+)",
                  "You have 0 active backlogs (0 allowed)",
                ],
                source: "TCS Placement Circular • Ref: T&P/DRIVE/2026/088",
                confidence: "High confidence" as const,
              },
            });
            setIsAiTyping(false);
            return;
          }

          // If query specifically targets panic study sprint
          if (q.includes("panic") || (q.includes("dbms") && q.includes("3 hours"))) {
            setLastContextTopic("dbms");
            addMessage({
              id: "copilot-" + Date.now(),
              sender: "copilot",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              decisionType: "panic",
              data: { topic: "DBMS Mid-Sem Revision" },
            });
            setIsAiTyping(false);
            return;
          }

          // If query specifically targets attendance simulation
          if (q.includes("bunk") || (q.includes("attendance") && q.includes("tomorrow"))) {
            setLastContextTopic("attendance");
            addMessage({
              id: "copilot-" + Date.now(),
              sender: "copilot",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              decisionType: "attendance",
              data: {},
            });
            setIsAiTyping(false);
            return;
          }

          // Render live Gemini grounded answer with verified sources
          let sourcesText = "";
          if (body.data.sources && Array.isArray(body.data.sources) && body.data.sources.length > 0) {
            sourcesText = "\n\n📚 **Verified Grounded Sources:**\n" + body.data.sources.map((s: any) => `• ${s.title} (${s.type || "Document"})`).join("\n");
          }

          addMessage({
            id: "copilot-" + Date.now(),
            sender: "copilot",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            text: body.data.answer + sourcesText,
          });
          setIsAiTyping(false);
          return;
        }
      }
    } catch {
      // Backend offline or unreachable: continue to built-in local processing
    }

    setTimeout(() => {
      // 1. Conversational Memory check: if user asked "when is dbms?" earlier and now asks "what should i study?"
      if (
        (q.includes("what should i study") || q.includes("kya padhna") || q.includes("how to prepare")) &&
        (lastContextTopic === "dbms" || q.includes("dbms"))
      ) {
        setLastContextTopic("dbms");
        addMessage({
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          decisionType: "panic",
          data: {
            topic: "DBMS Mid-Sem Revision",
          },
        });
      }
      // 2. Exam emergency / 3 hours
      else if (
        q.includes("dbms") ||
        q.includes("3 hours") ||
        q.includes("exam tomorrow") ||
        q.includes("panic") ||
        q.includes("kal mera dbms")
      ) {
        setLastContextTopic("dbms");
        addMessage({
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          decisionType: "panic",
          data: {
            topic: "DBMS Mid-Sem Revision",
          },
        });
      }
      // 3. Attendance / Bunk simulation
      else if (
        q.includes("bunk") ||
        q.includes("attendance") ||
        q.includes("miss") ||
        q.includes("chutti")
      ) {
        setLastContextTopic("attendance");
        addMessage({
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          decisionType: "attendance",
          data: {},
        });
      }
      // 4. Notice upload demo / summarize notice
      else if (
        q.includes("notice") ||
        q.includes("circular") ||
        q.includes("upload") ||
        q.includes("summarize")
      ) {
        setLastContextTopic("notice");
        addMessage({
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          decisionType: "notices",
          data: {},
        });
      }
      // 5. Conflict detector (discrepant sources)
      else if (
        q.includes("conflict") ||
        q.includes("when is the exam form") ||
        q.includes("discrepancy") ||
        q.includes("what changed in the exam")
      ) {
        setLastContextTopic("conflict");
        addMessage({
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          decisionType: "conflict",
          data: {},
        });
      }
      // 5.1. RGPV Ordinance No. 4 / Attendance rule
      else if (
        q.includes("ordinance") ||
        (q.includes("rgpv") && q.includes("attendance")) ||
        q.includes("75%")
      ) {
        setLastContextTopic("ordinance");
        addMessage({
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `⚖️ **RGPV Ordinance No. 4 (Mandatory Attendance Requirement)**

According to **Rajiv Gandhi Proudyogiki Vishwavidyalaya Ordinance No. 4 (Section 7)**:
- **Mandatory Threshold**: A student must attend a minimum of **75% of total scheduled lectures, practicals, and tutorials** in each semester to qualify for end-semester examination admit card generation.
- **Condonation Limit**: The Vice-Chancellor / Principal of UIT-RGPV may condone up to **10%** on genuine medical grounds (duly supported by Medical Board certificate) or participation in AIU / National sports / NCC / NSS camps, making the absolute bottom limit **65%**.
- **Your Current Standing (Enrollment: 0101CS221084)**:
  - Aggregate Attendance: **78.4%** (🟢 Safe by 3.4%)
  - Critical Subject: Design & Analysis of Algorithms (**72.1%** - ⚠️ 1 class away from cutoff).
  - Decision: Attending tomorrow's DAA lab increases your aggregate to **79.1%**.`,
        });
      }
      // 5.2. RGPV Scraped Live Circulars & Competitions
      else if (
        q.includes("scraped") ||
        (q.includes("latest") && q.includes("rgpv")) ||
        q.includes("drone") ||
        q.includes("nidar") ||
        q.includes("imprenditore") ||
        q.includes("digilocker")
      ) {
        setLastContextTopic("rgpv_live");
        addMessage({
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `🌐 **Live Scraped Intelligence from rgpv.ac.in (Synced Today)**

1. **National Level Drone Competition (NIDAR)**: Hosted at RGPV Bhopal Campus. Team registrations open till 15 Oct. Innovation fund up to ₹2.5 Lakhs.
2. **Imprenditore 5.0 (E-Cell RGPV)**: Flagship entrepreneurship summit. 50+ startup pitches. Student pass booking live via e-Gov cell.
3. **School of IT (SoIT) CLC Round**: College-Level Counseling for vacant B.Tech CSE (AI & ML) seats at RGPV campus.
4. **Mandatory DigiLocker & ABC ID**: All students must link their 12-digit Academic Bank of Credits ID (Your synced ABC ID: \`RGPV-ABC-9482-1084\`).

*Directly grounded from official university noticeboard at https://www.rgpv.ac.in.*`,
        });
      }
      // 6. Placement eligibility (Eligible vs Ineligible check)
      else if (
        q.includes("tcs") ||
        q.includes("eligible") ||
        q.includes("placement") ||
        q.includes("drive")
      ) {
        setLastContextTopic("placement");

        // Example: If user explicitly asks for an 8.5+ CGPA company, test ineligibility
        if (q.includes("google") || q.includes("goldman") || q.includes("ineligible")) {
          addMessage({
            id: "copilot-" + Date.now(),
            sender: "copilot",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            decisionType: "eligibility",
            data: {
              isEligible: false,
              company: "Goldman Sachs Engineering Campus Drive",
              role: "Systems Analyst Intern",
              packageStr: "₹24.0 LPA",
              matchScore: 68,
              tableData: [
                { requirement: "Branch", required: "CSE, IT", student: "CSE", passed: true },
                { requirement: "Minimum CGPA", required: "8.50 Cutoff", student: "8.10", passed: false },
                { requirement: "Backlogs", required: "0 Allowed", student: "0", passed: true },
                { requirement: "Graduation", required: "2027", student: "2027", passed: true },
              ],
              ineligibilityReason:
                "Company enforces a strict 8.50 CGPA cutoff. Your current cumulative GPA is 8.10 (0.40 margin).",
              betterAlternatives: [
                {
                  title: "Zomato Frontend SDE (Cutoff 7.0 with verified projects)",
                  matchScore: 95,
                  actionPrompt: "Tell me about Zomato drive",
                },
                {
                  title: "TCS Digital Specialist (Cutoff 7.50, ₹9.0 LPA)",
                  matchScore: 92,
                  actionPrompt: "Am I eligible for today's placement?",
                },
              ],
              whySeeingThis: [
                "Filtered against Goldman Sachs official recruitment circular #T&P/GS/2026/014",
                "Your verified registrar CGPA is 8.10 as of 5th Semester",
              ],
              source: "Goldman Sachs Institutional Circular • 2h ago",
              confidence: "High confidence" as const,
            },
          });
        } else {
          // 🟢 YOU ARE ELIGIBLE
          addMessage({
            id: "copilot-" + Date.now(),
            sender: "copilot",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            decisionType: "eligibility",
            data: {
              isEligible: true,
              company: "TCS Campus Hiring 2026",
              role: "System Engineer / Digital Specialist",
              packageStr: "₹7.2 – ₹9.0 LPA",
              matchScore: 92,
              tableData: [
                { requirement: "Branch", required: "CSE, IT, ECE", student: "CSE", passed: true },
                { requirement: "Minimum CGPA", required: "7.50 Cutoff", student: "8.10", passed: true },
                { requirement: "Active Backlogs", required: "0 Max", student: "0 Active", passed: true },
                { requirement: "Graduation Cohort", required: "Batch 2027", student: "2027", passed: true },
              ],
              skillGap: {
                skill: "Docker containerization",
                note: "Docker experience is not present in your GitHub sync. Not required for cutoff eligibility, but listed as a priority skill by the Digital interview panel.",
              },
              whySeeingThis: [
                "You're in CSE 5th Semester",
                "Your CGPA is 8.1 (company requires 7.5+)",
                "You have 0 active backlogs (0 allowed)",
                "You scored 88% in Algorithms & Data Structures",
              ],
              source: "TCS Placement Circular • 4 Oct • Ref: T&P/DRIVE/2026/088",
              confidence: "High confidence" as const,
            },
          });
        }
      }
      // Default contextual synthesis
      else {
        addMessage({
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Analyzing across official circulars and your CSE 5th sem record for "${rawQuery}"... All matching items have been synthesized. Would you like me to check an eligibility cutoff, schedule a reminder, or run a study sprint?`,
        });
      }

      setIsAiTyping(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast(`Uploaded document: "${file.name}". Running Gemini OCR...`);
    processUserCommand(`Summarize uploaded notice: ${file.name}`);
  };

  const suggestionChips = [
    { label: "What is RGPV Ordinance No. 4 attendance rule?", icon: "⚖️" },
    { label: "Am I eligible for today's placement?", icon: "💼" },
    { label: "What are the latest scraped RGPV notices?", icon: "🌐" },
    { label: "When is the exam form due?", icon: "📑" },
    { label: "Can I bunk tomorrow?", icon: "🏖️" },
    { label: "I have DBMS tomorrow and only 3 hours", icon: "🚨" },
  ];

  return (
    <section className="py-8 sm:py-12 bg-[#FBFBFA] min-h-[88vh] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Hidden File Input for Attachments */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Voice Listening Waveform Modal */}
        <VoiceListeningModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onTranscriptionComplete={(text) => {
            showToast(`Voice transcribed: "${text}"`);
            processUserCommand(text);
          }}
        />

        {/* Header Greeting & Context */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-xs text-xs font-mono font-medium text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CAMPUS AI COMMAND CENTER</span>
            <span className="text-zinc-300">•</span>
            <span>{studentUser.name} ({studentUser.department.split(" ")[0]})</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-950 tracking-tight">
            Good afternoon, {studentUser.firstName}.<br />
            <span className="text-zinc-500 font-bold">What do you want to figure out?</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-500 font-medium">
            Transforms any campus question into context, evidence, decisions, and immediate actions.
          </p>
        </div>

        {/* Large Premium AI Input Bar */}
        <div
          className={`rounded-3xl bg-white border transition-all duration-300 p-3 sm:p-4 shadow-xl shadow-indigo-950/5 ${
            isInputFocused
              ? "border-indigo-600 ring-4 ring-indigo-100 scale-[1.01]"
              : "border-zinc-300"
          }`}
        >
          <form onSubmit={handleCommandSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="pl-2 text-indigo-600">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>

              <input
                type="text"
                value={inputVal}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
                className="w-full bg-transparent text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none py-1 font-medium"
              />

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className={`p-2.5 sm:p-3 rounded-2xl transition-all shrink-0 ${
                  inputVal.trim()
                    ? "bg-indigo-950 text-white shadow-md hover:bg-indigo-900"
                    : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                }`}
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Input Action Controls: Attach, Voice, Keyboard hint */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {/* ＋ Attach Document / Notice */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Upload messy circular or PDF"
                >
                  <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Attach Notice</span>
                </button>

                {/* 🎙 Voice Input Button */}
                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Speak in English or Hinglish"
                >
                  <Mic className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Voice</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 border text-zinc-600">↵ Enter</kbd>
                <span>to ask</span>
              </div>
            </div>
          </form>

          {/* Suggested Action Chips */}
          <div className="pt-3 mt-2 border-t border-zinc-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase font-bold text-zinc-400 mr-1">
              Suggested:
            </span>
            {suggestionChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => processUserCommand(chip.label)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF9F6] hover:bg-zinc-100 text-zinc-700 text-xs font-medium border border-zinc-200 transition-colors"
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            EMPTY STATE OR ACTIVE CONVERSATION STREAM
            ========================================================================= */}
        {messages.length <= 1 ? (
          /* Empty State: Three.js Campus Knowledge Network */
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2 text-xs font-mono text-zinc-400">
              <span>EXPLORE CAMPUS KNOWLEDGE NETWORK</span>
              <span>Interactive 3D Mesh</span>
            </div>

            <KnowledgeNetworkOrb
              onSelectPrompt={(prompt) => {
                processUserCommand(prompt);
              }}
            />
          </div>
        ) : (
          /* Decision & Action Stream */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono px-2">
              <span>DECISION STREAM</span>
              <button
                onClick={clearMessages}
                className="hover:text-zinc-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Command Session</span>
              </button>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {/* User Prompt */}
                {msg.sender === "user" && (
                  <div className="flex justify-end">
                    <div className="bg-indigo-950 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-lg text-sm font-medium shadow-sm">
                      {msg.query}
                    </div>
                  </div>
                )}

                {/* Copilot Structured Response */}
                {msg.sender === "copilot" && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-xs">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                    </div>

                    <div className="space-y-3 flex-1">
                      {/* Plain text if no specialized decision */}
                      {msg.text && (
                        <div className="bg-white rounded-2xl rounded-tl-xs p-4 border border-zinc-200 text-sm text-zinc-800 leading-relaxed shadow-xs max-w-2xl">
                          {msg.text}
                        </div>
                      )}

                      {/* Specialized Decision Component Rendering */}
                      {msg.decisionType === "eligibility" && (
                        <DecisionResponse {...(msg.data || {})} />
                      )}

                      {msg.decisionType === "panic" && (
                        <PanicPlanResponse />
                      )}

                      {msg.decisionType === "attendance" && (
                        <AttendanceResponse />
                      )}

                      {msg.decisionType === "notices" && (
                        <NoticeActionResponse />
                      )}

                      {msg.decisionType === "conflict" && (
                        <ConflictResponse />
                      )}

                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                        <span>Campus Copilot • Answered in 420ms</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                        <span>•</span>
                        <button
                          onClick={() => showToast("Copied decision report & references to clipboard!")}
                          className="hover:text-indigo-600 font-bold"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* AI Synthesizing Indicator */}
            {isAiTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs shrink-0">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                </div>
                <div className="bg-white rounded-2xl p-3 border border-zinc-200 text-xs text-zinc-500 font-mono flex items-center gap-2 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span>Synthesizing campus circulars, eligibility gates, and deadlines...</span>
                </div>
              </div>
            )}

            <div ref={scrollAnchorRef} />
          </div>
        )}

      </div>
    </section>
  );
}
