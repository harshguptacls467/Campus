import zlib from "zlib";
import { StudyDocumentType } from "../types";
import { config } from "../config";
import { GoogleGenAI } from "@google/genai";

/**
 * Robust extraction of text from DOCX, PDF, images, and text files.
 */
export class TextExtractor {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (config.geminiApiKey) {
      this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
  }

  /**
   * Extract text from various file formats
   */
  async extractText(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<string> {
    const lowerFilename = filename.toLowerCase();

    // 1. Text, Markdown, CSV, JSON
    if (
      mimeType.startsWith("text/") ||
      lowerFilename.endsWith(".txt") ||
      lowerFilename.endsWith(".md") ||
      lowerFilename.endsWith(".csv") ||
      mimeType === "application/json"
    ) {
      return buffer.toString("utf-8");
    }

    // 2. DOCX Files (ZIP archive containing word/document.xml)
    if (
      lowerFilename.endsWith(".docx") ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const docxText = this.extractDocxText(buffer);
      if (docxText && docxText.trim().length > 10) {
        return docxText;
      }
    }

    // 3. PDF and Images using Gemini Vision OCR if available
    if (
      this.ai &&
      (mimeType.startsWith("image/") || mimeType === "application/pdf" || lowerFilename.endsWith(".pdf"))
    ) {
      try {
        const base64Data = buffer.toString("base64");
        const effectiveMime = mimeType === "application/pdf" ? "application/pdf" : mimeType.startsWith("image/") ? mimeType : "application/pdf";

        const response = await this.ai.models.generateContent({
          model: config.geminiModel,
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: effectiveMime,
                    data: base64Data,
                  },
                },
                {
                  text: "Please transcribe and extract all textual content from this study document completely and accurately. Preserve headings, unit numbers, dates, questions, and topics faithfully without summarizing or adding commentary.",
                },
              ],
            },
          ],
        });

        if (response.text && response.text.trim().length > 0) {
          return response.text.trim();
        }
      } catch (err) {
        console.warn("Gemini multimodal OCR failed or timed out:", err);
      }
    }

    // 4. Fallback text stream extraction for PDF or binaries
    const rawAscii = buffer.toString("binary");
    // Extract stream blocks if PDF
    if (rawAscii.startsWith("%PDF")) {
      const textMatches = rawAscii.match(/\(([^()]{3,})\)[\s]*Tj/g);
      if (textMatches && textMatches.length > 5) {
        return textMatches
          .map((m) => m.replace(/^[(\s]+|[)\s*Tj]+$/g, ""))
          .join(" ")
          .trim();
      }
    }

    // Final fallback: readable ASCII chunks
    const readable = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
    if (readable.trim().length > 20) {
      return readable.replace(/\s{2,}/g, " ").trim();
    }

    return `Document: ${filename}`;
  }

  /**
   * Zero-dependency ZIP/DOCX parser to extract word/document.xml
   */
  private extractDocxText(buffer: Buffer): string {
    try {
      let offset = 0;
      const len = buffer.length;

      while (offset < len - 30) {
        // Look for Local File Header signature 0x04034b50 ('PK\x03\x04')
        if (
          buffer[offset] === 0x50 &&
          buffer[offset + 1] === 0x4b &&
          buffer[offset + 2] === 0x03 &&
          buffer[offset + 3] === 0x04
        ) {
          const compressionMethod = buffer.readUInt16LE(offset + 8);
          const compressedSize = buffer.readUInt32LE(offset + 18);
          const uncompressedSize = buffer.readUInt32LE(offset + 22);
          const fileNameLength = buffer.readUInt16LE(offset + 26);
          const extraFieldLength = buffer.readUInt16LE(offset + 28);

          const fileNameStart = offset + 30;
          const fileName = buffer.toString("utf-8", fileNameStart, fileNameStart + fileNameLength);

          const dataStart = fileNameStart + fileNameLength + extraFieldLength;
          if (fileName === "word/document.xml" && dataStart + compressedSize <= len) {
            const compressedData = buffer.slice(dataStart, dataStart + compressedSize);
            let xmlContent = "";

            if (compressionMethod === 8) {
              // Deflate
              const decompressed = zlib.inflateRawSync(compressedData);
              xmlContent = decompressed.toString("utf-8");
            } else if (compressionMethod === 0) {
              // Uncompressed
              xmlContent = compressedData.toString("utf-8");
            }

            if (xmlContent) {
              // Extract text from <w:t> tags and preserve line breaks for <w:p>
              const paragraphs = xmlContent.split(/<\/w:p>/gi);
              const lines = paragraphs.map((p) => {
                const textNodes = p.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/gi) || [];
                return textNodes.map((t) => t.replace(/<[^>]+>/g, "")).join("");
              });
              return lines.filter((l) => l.trim().length > 0).join("\n");
            }
          }

          offset = dataStart + compressedSize;
        } else {
          offset++;
        }
      }
    } catch (e) {
      console.warn("DOCX extraction error:", e);
    }
    return "";
  }

  /**
   * Automatically detect the document type: syllabus, timetable, pyq, or notes
   */
  detectDocumentType(
    filename: string,
    extractedText: string
  ): "syllabus" | "timetable" | "pyq" | "notes" {
    const combined = `${filename} ${extractedText}`.toLowerCase();

    // 1. Timetable / Exam Schedule
    if (
      /time\s*table|datesheet|date\s*sheet|exam\s*schedule|paper\s*schedule|exam\s*dates/i.test(filename) ||
      (/time\s*table|date\s*sheet|exam\s*date/i.test(combined) && /(?:10:00|02:00|a\.m\.|p\.m\.|shifts?|room|slot)/i.test(combined))
    ) {
      return "timetable";
    }

    // 2. PYQ (Previous Year Questions)
    if (
      /pyq|previous\s*year|question\s*paper|mid\s*sem\s*paper|end\s*sem\s*paper|rgpv\s*paper/i.test(filename) ||
      (/question\s*paper|attempt\s*all|maximum\s*marks|q\.?\s*\d|marks\s*:\s*\d+/i.test(combined) &&
        /(?:year|semester|b\.tech|session|202[0-9]|201[0-9])/i.test(combined))
    ) {
      return "pyq";
    }

    // 3. Syllabus
    if (
      /syllabus|curriculum|course\s*outline|subject\s*scheme/i.test(filename) ||
      (/unit\s*[1-5ivx]|unit\s*i\b|unit\s*ii\b|unit\s*iii\b/i.test(combined) &&
        /(?:topics|contents|prerequisites|course\s*outcome|text\s*books)/i.test(combined))
    ) {
      return "syllabus";
    }

    // 4. Notes
    if (
      /notes|lecture|summary|handwritten|module|study\s*material/i.test(filename) ||
      /definition|introduction|overview|key\s*points|architecture|diagram/i.test(combined)
    ) {
      return "notes";
    }

    // Heuristic fallbacks
    if (combined.includes("unit 1") || combined.includes("unit i") || combined.includes("course contents")) {
      return "syllabus";
    }
    if (combined.includes("q.1") || combined.includes("question 1") || combined.includes("explain in detail")) {
      return "pyq";
    }

    return "notes";
  }
}

export const textExtractor = new TextExtractor();
