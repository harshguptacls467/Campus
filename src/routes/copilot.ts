import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { copilotService } from "../services/copilot.service";
import { DEFAULT_USER_ID } from "../db/supabase";
import { BadRequestError } from "../utils/errors";
import { authenticate } from "../middleware/auth";

interface AskBody {
  message: string;
  userId?: string;
}

export async function copilotRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  /**
   * POST /api/copilot/ask
   * Understands student intent, retrieves grounded documents + profile, returns decision & actions
   * Enforces authenticated user identity (ignores body.userId for security)
   */
  fastify.post<{ Body: AskBody }>(
    "/ask",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { message } = request.body || {};
      const userId = request.user?.id || DEFAULT_USER_ID;

      if (!message || typeof message !== "string" || !message.trim()) {
        throw new BadRequestError("Query message must be a non-empty string");
      }

      const response = await copilotService.ask(message.trim(), userId);

      return reply.status(200).send({
        success: true,
        data: response,
      });
    }
  );
}
