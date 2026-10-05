import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { documentService } from "../services/document.service";
import { DEFAULT_USER_ID } from "../db/supabase";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { authenticate } from "../middleware/auth";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export async function documentRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  /**
   * POST /api/documents/upload
   * Uploads notice PDF or photo image to Supabase Storage with user ownership
   */
  fastify.post(
    "/upload",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;

      // Check if multipart request
      if (!request.isMultipart()) {
        // Allow raw JSON with file_url or text for convenience
        const body = (request.body as any) || {};
        const filename = body.filename || "Uploaded_Circular.pdf";
        const mimeType = body.mimeType || "application/pdf";
        const dummyBuffer = Buffer.from(body.rawText || "Sample circular content");

        const doc = await documentService.uploadDocument(
          userId,
          dummyBuffer,
          filename,
          mimeType
        );

        return reply.status(201).send({
          success: true,
          document: doc,
        });
      }

      const data = await request.file({
        limits: { fileSize: MAX_FILE_SIZE_BYTES },
      });

      if (!data) {
        throw new BadRequestError("No document file attached in request");
      }

      if (!ALLOWED_MIME_TYPES.includes(data.mimetype)) {
        throw new BadRequestError(
          `Unsupported document format: ${data.mimetype}. Allowed: PDF, PNG, JPEG, WEBP.`
        );
      }

      const buffer = await data.toBuffer();
      const doc = await documentService.uploadDocument(
        userId,
        buffer,
        data.filename,
        data.mimetype
      );

      return reply.status(201).send({
        success: true,
        document: doc,
      });
    }
  );

  /**
   * POST /api/documents/:id/process
   * Sends document to Gemini for strict extraction, embeddings & action creation
   */
  fastify.post<{ Params: { id: string } }>(
    "/:id/process",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const body = (request.body as any) || {};
      const rawText = body.rawText as string | undefined;

      const userId = request.user?.id || DEFAULT_USER_ID;
      const result = await documentService.processDocument(id, rawText, userId);
      return reply.status(200).send({
        success: true,
        data: result,
      });
    }
  );

  /**
   * GET /api/notices
   * Returns list of extracted institutional notices
   */
  fastify.get("/notices", async (request: FastifyRequest, reply: FastifyReply) => {
    const notices = await documentService.getNotices();
    return reply.status(200).send({
      success: true,
      count: notices.length,
      notices,
    });
  });

  /**
   * GET /api/notices/:id
   * Returns single notice by id
   */
  fastify.get("/notices/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const notice = await documentService.getNoticeById(id);

    if (!notice) {
      throw new NotFoundError(`Notice with id "${id}" was not found`);
    }

    return reply.status(200).send({
      success: true,
      notice,
    });
  });
}
