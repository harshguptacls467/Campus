import fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { config } from "./config";
import { documentRoutes } from "./routes/documents";
import { copilotRoutes } from "./routes/copilot";
import { placementRoutes } from "./routes/placements";
import { profileRoutes } from "./routes/profile";
import { rgpvRoutes } from "./routes/rgpv";
import { studyRoutes } from "./routes/study";
import { studentRoutes } from "./routes/student";
import { actionRoutes } from "./routes/actions";
import { AppError } from "./utils/errors";
import { initializeDatabase } from "./db/init";

export async function buildServer() {
  await initializeDatabase();

  const app = fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
    },
  });

  // Security: CORS Configuration
  await app.register(cors, {
    origin: true, // Allow frontend dev & preview origins
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  // Multipart file upload handling with strict size limits
  await app.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 1000000,
      fields: 10,
      fileSize: 15 * 1024 * 1024, // 15 MB
      files: 1,
    },
  });

  // Global Error Handler
  app.setErrorHandler((error: any, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    if (error && typeof error.statusCode === "number") {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code || "REQUEST_ERROR",
          message: error.message,
        },
      });
    }

    request.log.error(error);
    return reply.status(500).send({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred on the server.",
      },
    });
  });

  // Healthcheck endpoint
  app.get("/health", async () => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Campus Copilot Backend Foundation",
      version: "0.1.0",
      features: {
        supabase: !config.isMockDb,
        gemini: !config.isMockGemini,
        pgvector: true,
      },
    };
  });

  // Register Core API Routes
  await app.register(documentRoutes, { prefix: "/api/documents" });
  await app.register(copilotRoutes, { prefix: "/api/copilot" });
  await app.register(placementRoutes, { prefix: "/api/placements" });
  await app.register(profileRoutes, { prefix: "/api/profile" });
  await app.register(rgpvRoutes, { prefix: "/api/rgpv" });
  await app.register(studyRoutes, { prefix: "/api/study" });
  await app.register(studentRoutes, { prefix: "/api/student" });
  await app.register(actionRoutes, { prefix: "/api/actions" });

  return app;
}

async function start() {
  const server = await buildServer();
  try {
    const address = await server.listen({
      port: config.port,
      host: config.host,
    });
    console.log(`\n🚀 Campus Copilot Fastify Server running at: ${address}`);
    console.log(`   Healthcheck: ${address}/health`);
    console.log(`   Supabase: ${config.isMockDb ? "In-Memory/Mock Mode" : "Connected"}`);
    console.log(`   Gemini: ${config.isMockGemini ? "Heuristic/Mock Mode" : "Configured"}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// Start if executed directly
if (require.main === module || process.env.RUN_STANDALONE === "true") {
  start();
}
