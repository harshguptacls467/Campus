import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { studentTodayService } from "../services/student-today.service";
import { DEFAULT_USER_ID, inMemoryDb, supabase } from "../db/supabase";
import { BadRequestError } from "../utils/errors";
import { authenticate } from "../middleware/auth";

export async function studentRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  /**
   * GET /api/student/today
   * “What Should I Do Today?” AI-synthesized intelligence briefing (authenticated)
   */
  fastify.get(
    "/today",
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const briefing = await studentTodayService.getStudentTodayBriefing(userId);

      return reply.status(200).send({
        success: true,
        data: briefing,
      });
    }
  );

  /**
   * PATCH /api/student/today/task
   * Marks a daily task as completed (enforces user ownership, ignores body.userId)
   */
  fastify.patch<{ Body: { taskId: string; completed?: boolean; dismissed?: boolean; status?: string; userId?: string } }>(
    "/today/task",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const { taskId, completed, dismissed, status: reqStatus } = request.body || {};

      if (!taskId) {
        throw new BadRequestError("taskId is required");
      }

      let newStatus: "pending" | "completed" | "dismissed" = "completed";
      if (reqStatus === "dismissed" || dismissed) {
        newStatus = "dismissed";
      } else if (reqStatus === "pending" || completed === false) {
        newStatus = "pending";
      } else if (reqStatus === "completed" || completed === true) {
        newStatus = "completed";
      }

      // Check if it's an action in Supabase / inMemoryDb
      const cleanId = taskId.replace(/^today-action-/, "");
      
      if (supabase) {
        try {
          await supabase
            .from("actions")
            .update({ status: newStatus })
            .eq("id", cleanId)
            .eq("user_id", userId);
        } catch (err) {
          console.warn("Supabase action update failed:", err);
        }
      }

      const action = inMemoryDb.actions.get(cleanId);
      if (action && (action.user_id === userId || !action.user_id)) {
        action.status = newStatus;
        inMemoryDb.actions.set(cleanId, action);
      }

      // Check if it's a study plan task owned by this user
      for (const plan of inMemoryDb.studyPlans.values()) {
        if (plan.user_id === userId && plan.plan_data?.dailySchedule) {
          for (const day of plan.plan_data.dailySchedule) {
            for (const t of day.tasks || []) {
              if (t.id === taskId || `today-study-${t.id}` === taskId) {
                t.completed = completed;
              }
            }
          }
        }
      }

      return reply.status(200).send({
        success: true,
        taskId,
        completed,
        message: completed ? "Task completed successfully" : "Task marked pending",
      });
    }
  );
}
