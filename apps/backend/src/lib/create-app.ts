// This file provides helper functions to create Elysia routers and apps.
// It sets up authentication, CORS, and OpenAPI configuration for the backend.
import { auth } from "./auth";
import cors from "@elysiajs/cors";
import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { configureOpenAPI } from "./configure-openapi";
import { AIService } from "./ai";

export function createRouter(
  options?: ConstructorParameters<typeof Elysia>[0]
) {
  return new Elysia(options).macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });
        if (!session)
          return status(401, {
            message: "Unauthorized",
            success: false,
          });

        return {
          user: session.user,
          session: session.session,
          aiService: new AIService(session.user.id),
        };
      },
    },
  });
}
export function createApp(options?: ConstructorParameters<typeof Elysia>[0]) {
  return createRouter({
    adapter: node(),
  }).use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
}

export type ElysiaApp = ReturnType<typeof createApp>;
export type ElysiaRouter = ReturnType<typeof createRouter>;
