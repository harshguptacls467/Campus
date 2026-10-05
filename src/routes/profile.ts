import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { inMemoryDb, supabase, DEFAULT_USER_ID } from "../db/supabase";
import { Profile } from "../types";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { authenticate } from "../middleware/auth";

export async function profileRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  /**
   * GET /api/profile
   * Returns authenticated student profile (ignores query.userId for security)
   */
  fastify.get(
    "/",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;

      let profile: Profile | undefined;
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
          if (!error && data) profile = data as Profile;
        } catch {
          // fallback to memory
        }
      }

      if (!profile) {
        profile = inMemoryDb.profiles.get(userId);
      }

      if (!profile) {
        profile = {
          id: userId,
          name: request.user?.name || "Student",
          branch: "CSE",
          semester: "5th Semester",
          cgpa: 7.8,
          backlogs: 0,
          graduation_year: 2027,
        };
        inMemoryDb.profiles.set(userId, profile);
      }

      return reply.status(200).send({
        success: true,
        profile,
      });
    }
  );

  /**
   * PUT /api/profile
   * Updates authenticated student profile (enforces ownership, ignores body.userId)
   */
  fastify.put<{ Body: Partial<Profile> & { userId?: string } }>(
    "/",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const body = request.body || {};
      const userId = request.user?.id || DEFAULT_USER_ID;

      let profile = inMemoryDb.profiles.get(userId);
      if (!profile && supabase) {
        try {
          const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
          if (data) profile = data as Profile;
        } catch {}
      }

      if (!profile) {
        profile = {
          id: userId,
          name: "Harsh Gupta",
          branch: "CSE",
          semester: "5th Semester",
          cgpa: 7.8,
          backlogs: 0,
          graduation_year: 2027,
        };
      }

      // Input Validation
      if (body.cgpa !== undefined) {
        if (typeof body.cgpa !== "number" || body.cgpa < 0 || body.cgpa > 10) {
          throw new BadRequestError("CGPA must be a number between 0.0 and 10.0");
        }
        profile.cgpa = parseFloat(body.cgpa.toFixed(2));
      }

      if (body.backlogs !== undefined) {
        if (typeof body.backlogs !== "number" || body.backlogs < 0) {
          throw new BadRequestError("Backlogs must be a non-negative integer");
        }
        profile.backlogs = Math.floor(body.backlogs);
      }

      if (body.graduation_year !== undefined) {
        if (typeof body.graduation_year !== "number" || body.graduation_year < 2020) {
          throw new BadRequestError("Graduation year must be a valid four-digit year");
        }
        profile.graduation_year = body.graduation_year;
      }

      if (body.name && typeof body.name === "string") {
        profile.name = body.name.trim();
      }
      if (body.branch && typeof body.branch === "string") {
        profile.branch = body.branch.trim();
      }
      if (body.semester && typeof body.semester === "string") {
        profile.semester = body.semester.trim();
      }

      inMemoryDb.profiles.set(userId, profile);

      if (supabase) {
        await supabase.from("profiles").upsert(profile);
      }

      return reply.status(200).send({
        success: true,
        message: "Profile updated successfully",
        profile,
      });
    }
  );
}
