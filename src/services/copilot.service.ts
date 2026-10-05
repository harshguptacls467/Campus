import { inMemoryDb, supabase, DEFAULT_USER_ID } from "../db/supabase";
import { Profile, CopilotResponse, DocumentRecord, RgpvNoticeRecord } from "../types";
import { geminiService } from "./gemini.service";
import { rgpvScraperService } from "./rgpv-scraper.service";
import { studyService } from "./study.service";
import { actionService } from "./action.service";
import { cosineSimilarity } from "../utils/embeddings";

export class CopilotService {
  /**
   * Process a student message with grounded campus intelligence
   */
  async ask(message: string, userId: string = DEFAULT_USER_ID): Promise<CopilotResponse> {
    // 1. Retrieve student profile
    let profile: Profile | undefined;

    if (supabase) {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (data) profile = data as Profile;
    }

    if (!profile) {
      profile = inMemoryDb.profiles.get(userId) || inMemoryDb.profiles.get(DEFAULT_USER_ID);
    }

    if (!profile) {
      profile = {
        id: userId,
        name: "Isha Sharma",
        branch: "CSE",
        semester: "5th Semester",
        cgpa: 7.8,
        backlogs: 0,
        graduation_year: 2027,
      };
    }

    // 2. Retrieve relevant campus documents, RGPV notices, and uploaded study materials
    const queryEmbedding = await geminiService.generateEmbedding(message);
    const [relevantDocs, relevantRgpvNotices, userStudyMaterials] = await Promise.all([
      this.retrieveRelevantDocuments(queryEmbedding, message, userId),
      rgpvScraperService.searchNotices(message, 3),
      studyService.getStudyMaterials(userId),
    ]);

    // Filter relevant study materials based on message query
    const stopWords = new Set(["what", "is", "the", "for", "and", "campus", "college", "about", "tell", "when", "where", "how", "with", "this", "that", "are", "you"]);
    const terms = message.toLowerCase().split(/\s+/).filter((t) => t.length > 2 && !stopWords.has(t));
    const matchedStudyMaterials = userStudyMaterials.filter((m) => {
      const corpus = `${m.subject} ${m.study_type} ${m.extracted_text || ""}`.toLowerCase();
      return terms.some((t) => corpus.includes(t));
    });

    // 3. Construct minimal, accurate context merging documents, RGPV gazettes, and study materials
    const docContextParts = relevantDocs.map(
      (d, idx) =>
        `[Source Doc ${idx + 1}: ${d.title}]\n${d.extracted_text || JSON.stringify(d.extracted_data || {})}`
    );

    const rgpvContextParts = relevantRgpvNotices.map((n, idx) => {
      const parts = [
        `[Source RGPV Gazette ${idx + 1}: ${n.title}]`,
        `Source: ${n.source_name} (${n.source_url})`,
        n.category ? `Category: ${n.category}` : null,
        n.date ? `Published: ${n.date}` : null,
        n.deadline ? `Deadline: ${n.deadline}` : null,
        n.eligibility ? `Eligibility: ${n.eligibility}` : null,
        n.description ? `Description: ${n.description}` : null,
        n.document_url ? `Official Document Link: ${n.document_url}` : null,
      ].filter(Boolean);
      return parts.join("\n");
    });

    const studyContextParts = matchedStudyMaterials.slice(0, 4).map((m, idx) => {
      let details = "";
      if (m.study_type === "syllabus") {
        const syl = m.structured_data as any;
        details = (syl.units || [])
          .map((u: any) => `Unit ${u.unitNumber} (${u.unitTitle}): ${(u.topics || []).join(", ")}`)
          .join(" | ");
      } else if (m.study_type === "timetable") {
        const tt = m.structured_data as any;
        details = (tt.entries || [])
          .map((e: any) => `${e.subject}: ${e.examDate} (${e.examTime || "Standard slot"})`)
          .join(" | ");
      } else if (m.study_type === "pyq") {
        const pyq = m.structured_data as any;
        details = `Year: ${pyq.year || "Past Paper"} | Questions: ${(pyq.questions || []).slice(0, 6).map((q: any) => `${q.questionNumber || "Q"}: ${q.question} (${q.marks || 7} marks)`).join("; ")}`;
      } else {
        const notes = m.structured_data as any;
        details = notes.content || (notes.topics || []).map((t: any) => `${t.topic}: ${t.summary}`).join("; ") || (m.extracted_text || "").slice(0, 400);
      }

      return `[Study Intelligence: ${m.study_type.toUpperCase()} - ${m.subject}]\nSource: Student Upload (${m.file_name})\nContent: ${details}`;
    });

    // Also include high-frequency PYQ analysis if relevant
    if (/pyq|past\s*paper|repeated|frequent|marks|weightage|important/i.test(message)) {
      try {
        const pyqAnalysis = await studyService.analyzePyqs(userId);
        if (pyqAnalysis.topics.length > 0) {
          const topTopics = pyqAnalysis.topics.slice(0, 5).map(
            (t) => `${t.topic} (${t.priority} Priority, Asked ${t.questionCount}x in ${t.yearsAsked.join(", ")})`
          ).join("; ");
          studyContextParts.push(
            `[PYQ Intelligence Summary: ${pyqAnalysis.subject}]\nVerified Analysis: Top High-Frequency Topics: ${topTopics}`
          );
        }
      } catch {
        // ignore
      }
    }

    const campusContext = [
      ...docContextParts,
      ...rgpvContextParts,
      ...studyContextParts,
    ].join("\n\n---\n\n");

    // 4. Query Gemini with strict grounded prompt
    const response = await geminiService.answerCopilotQuery(message, profile, campusContext);

    // 5. When Copilot detects a deadline or actionable task, generate actionable item (Rules 1, 2, 5, 8, 9, 10)
    if (response.actions && response.actions.length > 0) {
      const enrichedActions = [];
      const primarySource = response.sources?.[0];

      for (const act of response.actions) {
        try {
          const actionResult = await actionService.createAction(userId, {
            title: act.title,
            due_at: act.due_at || null,
            priority: (act as any).priority,
            action_type: (act as any).action_type || act.type || "reminder",
            source_id: primarySource?.document_id || null,
            source: primarySource
              ? {
                  document_id: primarySource.document_id || null,
                  source_name: primarySource.title,
                  source_url: primarySource.url || null,
                  file_name: null,
                }
              : null,
          });

          enrichedActions.push({
            id: actionResult.action.id,
            type: actionResult.action.type,
            title: actionResult.action.title,
            due_at: actionResult.action.due_at,
            priority: actionResult.action.priority,
            action_type: actionResult.action.action_type,
            source: actionResult.action.source,
            status: actionResult.action.status,
            payload: act.payload || null,
            calendar_url: actionResult.action.calendar_url,
            has_conflict: actionResult.action.has_conflict,
            conflict_warning: actionResult.action.conflict_warning || actionResult.warning,
          });
        } catch (err) {
          console.warn("Failed to generate actionable item in Copilot:", err);
          enrichedActions.push(act);
        }
      }
      response.actions = enrichedActions;
    }

    return response;
  }

  /**
   * Perform semantic vector search over documents via pgvector or cosine similarity
   */
  private async retrieveRelevantDocuments(
    queryEmbedding: number[],
    queryText: string,
    userId: string = DEFAULT_USER_ID
  ): Promise<DocumentRecord[]> {
    // If Supabase pgvector RPC function or documents table is available:
    if (supabase) {
      try {
        const { data, error } = await supabase.rpc("match_documents", {
          query_embedding: queryEmbedding,
          match_threshold: 0.5,
          match_count: 3,
        });

        if (!error && data && data.length > 0) {
          const filtered = (data as DocumentRecord[]).filter(
            (d) => d.user_id === userId || !d.user_id
          );
          if (filtered.length > 0) return filtered;
        }
      } catch {
        // Fall through to in-memory/table query
      }
    }

    // In-Memory similarity fallback with user ownership filtering
    const allDocs = Array.from(inMemoryDb.documents.values()).filter(
      (d) => d.user_id === userId || !d.user_id || d.user_id === DEFAULT_USER_ID
    );
    if (allDocs.length === 0) {
      // Return representative default circulars
      return [
        {
          id: "doc-exam-1",
          user_id: DEFAULT_USER_ID,
          title: "Exam Form Registration 2026-27 (Circular EXAM/2026/419)",
          file_url: "https://storage.campus.edu/documents/Circular_EXAM_419.pdf",
          document_type: "application/pdf",
          extracted_text:
            "OFFICE OF THE CONTROLLER OF EXAMINATIONS. CIRCULAR REF: EXAM/2026/419. B.Tech 5th Semester (CSE/AIML/DS/IT/ECE). Submission Deadline: 11 October 2026 11:59 PM. Late fine of Rs 500 thereafter.",
          extracted_data: null,
          created_at: new Date().toISOString(),
        },
        {
          id: "doc-tcs-1",
          user_id: DEFAULT_USER_ID,
          title: "TCS Digital Placement Circular (T&P/2026/088)",
          file_url: "https://storage.campus.edu/documents/TCS_Circular.pdf",
          document_type: "application/pdf",
          extracted_text:
            "TRAINING & PLACEMENT CELL. TCS Digital Drive 2027 batch. Minimum CGPA required: 7.5. Eligible branches: CSE, IT, ECE. 0 active backlogs. Deadline: Tomorrow 11:59 PM.",
          extracted_data: null,
          created_at: new Date().toISOString(),
        },
      ];
    }

    // Rank by cosine similarity
    const scored = allDocs.map((doc) => {
      let sim = 0;
      if (doc.embedding && queryEmbedding) {
        sim = cosineSimilarity(queryEmbedding, doc.embedding);
      } else {
        // Text keyword fallback score
        const docText = (doc.title + " " + (doc.extracted_text || "")).toLowerCase();
        const words = queryText.toLowerCase().split(/\s+/);
        const matches = words.filter((w) => w.length > 3 && docText.includes(w)).length;
        sim = matches / Math.max(1, words.length);
      }
      return { doc, sim };
    });

    scored.sort((a, b) => b.sim - a.sim);
    return scored
      .filter((s) => s.sim >= 0.55)
      .slice(0, 3)
      .map((s) => s.doc);
  }
}

export const copilotService = new CopilotService();
