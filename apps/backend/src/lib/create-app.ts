import { auth } from "@/lib/auth";
import cors from "@elysiajs/cors";
import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { configureOpenAPI } from "./configure-openapi";
import { AIService } from "@/lib/ai";

export function createRouter(
  options?: ConstructorParameters<typeof Elysia>[0]
) {
  return new Elysia(options).macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });
        console.log("Auth session:", session);
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
export async function createApp(
  options?: ConstructorParameters<typeof Elysia>[0]
) {
  const app = createRouter({
    adapter: node(),
  });
  await configureOpenAPI(app);

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  return app;
}

export type ElysiaApp = ReturnType<typeof createApp>;
export type ElysiaRouter = ReturnType<typeof createRouter>;
