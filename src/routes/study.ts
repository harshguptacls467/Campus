import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { studyService } from "../services/study.service";
import { DEFAULT_USER_ID } from "../db/supabase";
import { BadRequestError, NotFoundError, ForbiddenError } from "../utils/errors";
import { StudyPlanRequest, StudyDocumentType } from "../types";
import { authenticate } from "../middleware/auth";

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

const ALLOWED_STUDY_MIME_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export async function studyRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  /**
   * POST /api/study/upload
   * Upload study material (Syllabus, Timetable, PYQ, Notes) with user ownership
   * Supports multipart file upload or JSON payload
   */
  fastify.post(
    "/upload",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;

      // 1. Multipart file upload
      if (request.isMultipart()) {
        const data = await request.file({
          limits: { fileSize: MAX_FILE_SIZE_BYTES },
        });

        if (!data) {
          throw new BadRequestError("No document file attached in request");
        }

        if (
          data.mimetype &&
          !ALLOWED_STUDY_MIME_TYPES.includes(data.mimetype) &&
          !data.filename.match(/\.(pdf|docx|txt|jpg|jpeg|png|webp)$/i)
        ) {
          throw new BadRequestError(
            `Unsupported file format (${data.mimetype}). Supported formats: PDF, DOCX, TXT, PNG, JPEG, WEBP.`
          );
        }

        const buffer = await data.toBuffer();
        const fields: Record<string, any> = {};
        for (const [key, val] of Object.entries((data as any).fields || {})) {
          fields[key] = (val as any).value;
        }

        const forcedType = fields.study_type as StudyDocumentType | undefined;
        const subject = fields.subject as string | undefined;

        const material = await studyService.uploadAndProcessStudyMaterial(
          userId,
          buffer,
          data.filename,
          data.mimetype,
          forcedType,
          subject
        );

        return reply.status(201).send({
          success: true,
          message: `Successfully uploaded and parsed ${material.study_type}`,
          material,
        });
      }

      // 2. Direct JSON payload (convenient for raw text / tests / previews)
      const body = (request.body as any) || {};
      const filename = body.filename || "Study_Document.txt";
      const mimeType = body.mimeType || "text/plain";
      const rawContent = body.content || body.rawText || "";
      const forcedType = body.study_type as StudyDocumentType | undefined;
      const subject = body.subject as string | undefined;

      if (!rawContent && !body.fileBase64) {
        throw new BadRequestError("Missing file content or text in request body");
      }

      const buffer = body.fileBase64
        ? Buffer.from(body.fileBase64, "base64")
        : Buffer.from(rawContent, "utf-8");

      const material = await studyService.uploadAndProcessStudyMaterial(
        userId,
        buffer,
        filename,
        mimeType,
        forcedType,
        subject
      );

      return reply.status(201).send({
        success: true,
        message: `Successfully uploaded and parsed ${material.study_type}`,
        material,
      });
    }
  );

  /**
   * GET /api/study/materials
   * List student's uploaded study materials (enforces user ownership)
   */
  fastify.get(
    "/materials",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const query = (request.query as any) || {};
      const studyType = query.type || query.study_type;
      const subject = query.subject;

      const materials = await studyService.getStudyMaterials(userId, {
        study_type: studyType,
        subject,
      });

      return reply.status(200).send({
        success: true,
        count: materials.length,
        materials,
      });
    }
  );

  /**
   * GET /api/study/materials/:id
   * Get specific study material with structured data (enforces user ownership)
   */
  fastify.get<{ Params: { id: string } }>(
    "/materials/:id",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user?.id || DEFAULT_USER_ID;
      const materials = await studyService.getStudyMaterials(userId);
      const item = materials.find((m) => m.id === id);

      if (!item) {
        throw new NotFoundError(`Study material not found with id: ${id}`);
      }

      if (item.user_id && item.user_id !== userId) {
        throw new ForbiddenError("You do not have permission to view this study material");
      }

      return reply.status(200).send({
        success: true,
        material: item,
      });
    }
  );

  /**
   * POST /api/study/plan
   * Generate realistic day-wise study plan using syllabus + timetable + PYQs + notes
   * Enforces prioritization: Exam date → PYQ frequency → syllabus importance → available notes → remaining time
   */
  fastify.post(
    "/plan",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const body = (request.body as StudyPlanRequest) || {};
      const hoursPerDay = body.availableHoursPerDay || 3;

      if (hoursPerDay <= 0 || hoursPerDay > 16) {
        throw new BadRequestError("availableHoursPerDay must be between 1 and 16 hours");
      }

      const plan = await studyService.generateStudyPlan({
        user_id: userId,
        subject: body.subject,
        exams: body.exams,
        examDates: body.examDates,
        targetExamDate: body.targetExamDate,
        availableHoursPerDay: hoursPerDay,
        startDate: body.startDate,
        syllabusTopics: body.syllabusTopics,
        pyqTopicFrequency: body.pyqTopicFrequency,
        uploadedNotes: body.uploadedNotes,
        prefer8020Plan: body.prefer8020Plan,
      });

      return reply.status(200).send({
        success: true,
        plan,
      });
    }
  );

  /**
   * GET /api/study/plan
   * Get student's saved study plans from Supabase
   */
  fastify.get(
    "/plan",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const plans = await studyService.getSavedStudyPlans(userId);
      return reply.status(200).send({
        success: true,
        count: plans.length,
        plans,
        activePlan: plans[0] || null,
      });
    }
  );

  /**
   * PATCH /api/study/plan/task
   * Update task completion in saved study plan
   */
  fastify.patch(
    "/plan/task",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const body = (request.body as any) || {};
      const { planId, taskId, completed } = body;

      if (!taskId) {
        throw new BadRequestError("taskId is required");
      }

      const updated = await studyService.updateStudyPlanTask(
        userId,
        planId || "default",
        taskId,
        Boolean(completed)
      );

      return reply.status(200).send({
        success: true,
        message: "Study task progress updated",
        plan: updated,
      });
    }
  );

  /**
   * POST /api/study/pyq-analysis
   * Calculates topic frequency across available PYQs, returns topic, question count,
   * years asked, priority, and real related questions.
   */
  fastify.post(
    "/pyq-analysis",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const body = (request.body as any) || {};
      const subject = body.subject;
      const analysis = await studyService.analyzePyqs(userId, subject);
      return reply.status(200).send({
        success: true,
        analysis,
      });
    }
  );

  /**
   * GET /api/study/pyq-analysis
   * Query PYQ intelligence analysis for a subject
   */
  fastify.get(
    "/pyq-analysis",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const query = (request.query as any) || {};
      const subject = query.subject;
      const analysis = await studyService.analyzePyqs(userId, subject);
      return reply.status(200).send({
        success: true,
        analysis,
      });
    }
  );
}
