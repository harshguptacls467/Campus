import { inMemoryDb, supabase, DEFAULT_USER_ID } from "../db/supabase";
import { DocumentRecord, NoticeRecord, ActionRecord } from "../types";
import { geminiService, ExtractedNoticeSchema } from "./gemini.service";
import { config } from "../config";
import { NotFoundError, BadRequestError, ForbiddenError } from "../utils/errors";

export class DocumentService {
  /**
   * Upload file to Supabase Storage and create document entry
   */
  async uploadDocument(
    userId: string,
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<DocumentRecord> {
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let fileUrl = `https://storage.campus.edu/${config.storageBucket}/${documentId}_${filename}`;

    // Upload to Supabase Storage if configured
    if (supabase) {
      const storagePath = `${userId}/${documentId}_${filename}`;
      const { data, error } = await supabase.storage
        .from(config.storageBucket)
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!error && data) {
        const { data: pubData } = supabase.storage
          .from(config.storageBucket)
          .getPublicUrl(storagePath);
        fileUrl = pubData.publicUrl;
      }
    }

    const docRecord: DocumentRecord = {
      id: documentId,
      user_id: userId,
      title: filename.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
      file_url: fileUrl,
      document_type: mimeType,
      extracted_text: null,
      extracted_data: null,
      embedding: null,
      created_at: new Date().toISOString(),
    };

    // Store in Supabase or in-memory
    if (supabase) {
      await supabase.from("documents").insert({
        id: docRecord.id,
        user_id: docRecord.user_id,
        title: docRecord.title,
        file_url: docRecord.file_url,
        document_type: docRecord.document_type,
        created_at: docRecord.created_at,
      });
    }

    inMemoryDb.documents.set(docRecord.id, docRecord);
    return docRecord;
  }

  /**
   * Process document with Gemini: extract structured JSON + generate pgvector embedding
   */
  async processDocument(
    documentId: string,
    rawTextContent?: string,
    userId?: string
  ): Promise<{
    document: DocumentRecord;
    notice: NoticeRecord;
    actions: ActionRecord[];
    extractedData: ExtractedNoticeSchema;
  }> {
    let document = inMemoryDb.documents.get(documentId);

    if (!document && supabase) {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();
      if (data) document = data as DocumentRecord;
    }

    if (!document) {
      // Create on the fly if testing by ID
      document = {
        id: documentId,
        user_id: userId || DEFAULT_USER_ID,
        title: "Uploaded Campus Circular",
        file_url: `https://storage.campus.edu/${config.storageBucket}/${documentId}.pdf`,
        document_type: "application/pdf",
        extracted_text: rawTextContent || null,
        extracted_data: null,
        created_at: new Date().toISOString(),
      };
      inMemoryDb.documents.set(documentId, document);
    }

    // Enforce ownership: reject if document belongs to another user
    if (document.user_id && userId && document.user_id !== userId) {
      throw new ForbiddenError("You do not have permission to access or process this document");
    }

    const contentToAnalyze =
      rawTextContent ||
      document.extracted_text ||
      `OFFICE OF THE CONTROLLER OF EXAMINATIONS\nCIRCULAR REF: EXAM/2026/419\nSUBMISSION DEADLINE: 11 October 2026 up to 11:59 PM. Late fine of Rs 500 thereafter.\nELIGIBILITY: B.Tech 5th Semester CSE/AIML/DS/IT/ECE. Mandatory minimum 75% attendance.`;

    // 1. Gemini Document Understanding (Strict Schema)
    const extractedData = await geminiService.extractDocumentData(
      contentToAnalyze,
      document.document_type
    );

    // 2. Generate 768-dim Embedding for pgvector
    const embedding = await geminiService.generateEmbedding(
      `${extractedData.title}. Category: ${extractedData.category}. Deadline: ${extractedData.deadline}. Eligibility: ${extractedData.eligibility?.description || ""}`
    );

    // 3. Update Document Record
    document.extracted_text = contentToAnalyze;
    document.extracted_data = extractedData as any;
    document.embedding = embedding;

    if (supabase) {
      await supabase
        .from("documents")
        .update({
          extracted_text: document.extracted_text,
          extracted_data: document.extracted_data,
          embedding: document.embedding,
        })
        .eq("id", document.id);
    }

    // 4. Create Notice Record
    const noticeId = `not-${Date.now()}`;
    const noticeRecord: NoticeRecord = {
      id: noticeId,
      document_id: document.id,
      title: extractedData.title,
      category: extractedData.category,
      deadline: extractedData.deadline,
      eligibility: extractedData.eligibility,
      fee: extractedData.fee,
      required_documents: extractedData.required_documents,
      priority: extractedData.deadline ? "high" : "medium",
    };

    inMemoryDb.notices.set(noticeId, noticeRecord);
    if (supabase) {
      await supabase.from("notices").insert(noticeRecord);
    }

    // 5. Create Generated Actions
    const actionRecords: ActionRecord[] = extractedData.actions.map((act, idx) => {
      const actionId = `act-${Date.now()}-${idx}`;
      return {
        id: actionId,
        user_id: document.user_id,
        type: act.type,
        action_type: act.type,
        title: act.title,
        due_at: act.due_at,
        priority: act.due_at ? "high" : "medium",
        status: "pending",
        source_id: noticeId,
        source: {
          document_id: noticeId,
          source_name: noticeRecord.title,
          source_url: null,
          file_name: document.title,
        },
        calendar_synced: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    for (const a of actionRecords) {
      inMemoryDb.actions.set(a.id, a);
      if (supabase) {
        await supabase.from("actions").insert({
          id: a.id,
          user_id: a.user_id,
          type: a.type,
          title: a.title,
          due_at: a.due_at,
          status: a.status,
          source_id: a.source_id,
        });
      }
    }

    return {
      document,
      notice: noticeRecord,
      actions: actionRecords,
      extractedData,
    };
  }

  /**
   * Retrieve all notices
   */
  async getNotices(): Promise<NoticeRecord[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("deadline", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as NoticeRecord[];
      }
    }
    return Array.from(inMemoryDb.notices.values());
  }

  /**
   * Retrieve single notice by id
   */
  async getNoticeById(id: string): Promise<NoticeRecord | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        return data as NoticeRecord;
      }
    }
    return inMemoryDb.notices.get(id) || null;
  }
}

export const documentService = new DocumentService();
