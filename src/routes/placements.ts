import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { eligibilityService } from "../services/eligibility.service";
import { inMemoryDb, supabase, DEFAULT_USER_ID } from "../db/supabase";
import { Profile, PlacementRecord } from "../types";
import { NotFoundError } from "../utils/errors";
import { authenticate } from "../middleware/auth";

export async function placementRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  /**
   * GET /api/placements
   * List all active placement opportunities
   */
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const list: PlacementRecord[] = [];
    if (supabase) {
      const { data } = await supabase.from("placements").select("*");
      if (data && Array.isArray(data)) list.push(...data);
    }
    for (const p of inMemoryDb.placements.values()) {
      if (!list.some((existing) => existing.id === p.id)) {
        list.push(p);
      }
    }

    return reply.status(200).send({
      success: true,
      count: list.length,
      data: list,
    });
  });

  /**
   * POST /api/placements/:id/check-eligibility
   * Deterministic placement eligibility verification against authenticated student profile
   */
  fastify.post<{ Params: { id: string }; Body: { userId?: string } }>(
    "/:id/check-eligibility",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user?.id || DEFAULT_USER_ID;

      // 1. Fetch user profile from Supabase / inMemoryDb
      let profile: Profile | undefined;
      if (supabase) {
        const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
        if (data) profile = data as Profile;
      }
      if (!profile) {
        profile = inMemoryDb.profiles.get(userId) || inMemoryDb.profiles.get(DEFAULT_USER_ID);
      }

      if (!profile) {
        throw new NotFoundError(`Student profile with id "${userId}" not found`);
      }

      // 2. Perform deterministic criteria matching
      const result = await eligibilityService.checkEligibility(id, profile);

      return reply.status(200).send({
        success: true,
        data: result,
      });
    }
  );

  /**
   * POST /api/placements/:id/gap-analysis
   * Placement Gap Analysis:
   * Structured data: eligibility → gaps → priority → preparation_time → resources → action
   * Deterministic logic for CGPA/branch/backlog/graduation.
   * Gemini for qualitative reasoning & resource recommendation.
   * Cross-references uploaded student materials.
   */
  fastify.post<{ Params: { id: string }; Body: { currentSkills?: string[]; userId?: string } }>(
    "/:id/gap-analysis",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user?.id || DEFAULT_USER_ID;
      const { currentSkills } = request.body || {};

      // 1. Fetch authenticated user profile
      let profile: Profile | undefined;
      if (supabase) {
        const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
        if (data) profile = data as Profile;
      }
      if (!profile) {
        profile = inMemoryDb.profiles.get(userId) || inMemoryDb.profiles.get(DEFAULT_USER_ID);
      }

      if (!profile) {
        throw new NotFoundError(`Student profile with id "${userId}" not found`);
      }

      // 2. Perform placement gap analysis
      const analysis = await eligibilityService.analyzePlacementGaps(id, profile, currentSkills);

      return reply.status(200).send({
        success: true,
        data: analysis,
      });
    }
  );
}
