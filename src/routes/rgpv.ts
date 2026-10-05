import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { rgpvScraperService } from "../services/rgpv-scraper.service";
import { config } from "../config";

export async function rgpvRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  /**
   * GET /api/rgpv/notices
   * Returns normalized, stored notices from RGPV (Supabase / inMemoryDb)
   */
  fastify.get("/notices", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.query as any) || {};
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const category = query.category || undefined;

    const notices = await rgpvScraperService.getStoredNotices(limit, category);
    return reply.status(200).send({
      success: true,
      source: config.rgpvBaseUrl,
      source_name: config.rgpvSourceName,
      count: notices.length,
      data: notices,
    });
  });

  /**
   * GET /api/rgpv/search
   * Search through normalized RGPV notices by keyword/phrase
   */
  fastify.get("/search", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.query as any) || {};
    const q = (query.q || "").trim();
    const limit = query.limit ? parseInt(query.limit, 10) : 5;

    const results = await rgpvScraperService.searchNotices(q, limit);
    return reply.status(200).send({
      success: true,
      query: q,
      count: results.length,
      data: results,
    });
  });

  /**
   * POST /api/rgpv/sync
   * Backend sync endpoint to refresh notices directly from rgpv.ac.in and store in Supabase
   */
  fastify.post("/sync", async (request: FastifyRequest, reply: FastifyReply) => {
    const syncResult = await rgpvScraperService.syncRgpvData();
    return reply.status(200).send({
      success: true,
      message: "Successfully synchronized and normalized notices from rgpv.ac.in",
      ...syncResult,
    });
  });

  /**
   * GET /api/rgpv/sync
   * Idempotent sync trigger for automated crawlers or cron jobs
   */
  fastify.get("/sync", async (request: FastifyRequest, reply: FastifyReply) => {
    const syncResult = await rgpvScraperService.syncRgpvData();
    return reply.status(200).send({
      success: true,
      message: "Successfully synchronized and normalized notices from rgpv.ac.in",
      ...syncResult,
    });
  });

  /**
   * GET /api/rgpv/meta
   * Institutional profile & helpline for Rajiv Gandhi Proudyogiki Vishwavidyalaya
   */
  fastify.get("/meta", async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      universityName: "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
      hindiName: "राजीव गांधी प्रौद्योगिकी विश्वविद्यालय",
      acronym: "RGPV",
      location: "Airport Road, Gandhi Nagar, Bhopal, Madhya Pradesh 462033",
      status: "State Technological University of Madhya Pradesh",
      accreditation: "NAAC Grade 'A'",
      chancellor: "Hon'ble Governor of Madhya Pradesh",
      portalUrl: config.rgpvBaseUrl,
      noticesArchiveUrl: config.rgpvNoticesUrl,
      egovUrl: "https://egov.rgpv.ac.in/",
      studentHelpline: "0755-4944401",
      officialEmail: "egov@rgpv.ac.in",
      attendanceOrdinance: "RGPV Ordinance No. 4: Minimum 75% attendance mandatory for Admit Card",
      departments: [
        "University Institute of Technology (UIT-RGPV)",
        "School of Information Technology (SoIT)",
        "School of Nanotechnology (SoNT)",
        "School of Energy & Environment Management (SoEEM)",
        "School of Pharmaceutical Sciences (SoPS)",
        "School of Applied Management (SoAM)",
        "School of Architecture (SoA)",
      ],
    });
  });
}
