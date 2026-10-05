import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { actionService } from "../services/action.service";
import { DEFAULT_USER_ID } from "../db/supabase";
import { CreateActionInput, UpdateActionInput } from "../types";
import { authenticate } from "../middleware/auth";

export async function actionRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  /**
   * POST /api/actions
   * Create an actionable deadline or reminder item.
   * Enforces duplicate prevention, source preservation, Google Calendar sync, and conflict warnings.
   */
  fastify.post<{ Body: CreateActionInput }>(
    "/",
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Body: CreateActionInput }>, reply: FastifyReply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const input = request.body || {};

      const result = await actionService.createAction(userId, input);

      const statusCode = result.alreadyExists ? 200 : 201;
      return reply.status(statusCode).send({
        success: true,
        alreadyExists: result.alreadyExists || false,
        warning: result.warning || null,
        data: result.action,
      });
    }
  );

  /**
   * GET /api/actions
   * Query student actions by status (pending, completed, dismissed, all), priority, or type.
   */
  fastify.get<{
    Querystring: {
      status?: "pending" | "completed" | "dismissed" | "all";
      priority?: string;
      action_type?: string;
    };
  }>(
    "/",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const { status = "pending", priority, action_type } = request.query || {};

      const actions = await actionService.getActions(userId, {
        status,
        priority,
        action_type,
      });

      return reply.status(200).send({
        success: true,
        count: actions.length,
        status_filter: status,
        data: actions,
      });
    }
  );

  /**
   * PATCH /api/actions/:id
   * Update an existing action (mark completed, dismiss, update date or title).
   */
  fastify.patch<{
    Params: { id: string };
    Body: UpdateActionInput;
  }>(
    "/:id",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const { id } = request.params;
      const updates = request.body || {};

      const updated = await actionService.updateAction(userId, id, updates);

      return reply.status(200).send({
        success: true,
        message: "Action updated successfully",
        data: updated,
      });
    }
  );

  /**
   * DELETE /api/actions/:id
   * Delete or permanently remove an action.
   */
  fastify.delete<{
    Params: { id: string };
  }>(
    "/:id",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const userId = request.user?.id || DEFAULT_USER_ID;
      const { id } = request.params;

      const result = await actionService.deleteAction(userId, id);

      return reply.status(200).send({
        success: true,
        message: "Action removed successfully",
        id: result.id,
      });
    }
  );
}
