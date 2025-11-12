import { auth } from "@/lib/auth";
import {
  flashcardRoutes,
  quizRoutes,
  resourceRoutes,
  summaryRoutes,
  webpageRoutes,
} from "@/routes";
import { createApp } from "./lib/create-app";
import { env } from "./lib/env";

async function main() {
  const app = await createApp();
  app
    .mount("/auth", auth.handler)
    .use(webpageRoutes)
    .use(summaryRoutes)
    .use(quizRoutes)
    .use(flashcardRoutes)
    .use(resourceRoutes)
    .get("/", () => ({
      message: "Welcome to Noteminds API",
      version: "1.0.0",
      docs: "/docs",
    }))
    .get("/health", () => ({
      status: "healthy",
      timestamp: new Date().toISOString(),
    }))
    .listen(env.PORT, ({ hostname, port }) => {
      console.log(`🦊 Elysia is running at http://${hostname}:${port}`);
    });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
