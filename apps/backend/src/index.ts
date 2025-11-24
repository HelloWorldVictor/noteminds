import { auth } from "./lib/auth";
import {
  flashcardRoutes,
  quizRoutes,
  resourceRoutes,
  summaryRoutes,
  webpageRoutes,
  noteRoutes,
  searchRoutes,
} from "./routes";
import { createApp } from "./lib/create-app";
import { env } from "./lib/env";
import { edenFetch, treaty } from "@elysiajs/eden";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { OpenAPI } from "./lib/auth";

async function main() {
  const app = createApp()
    .mount("/auth", auth.handler)
    .use(webpageRoutes)
    .use(summaryRoutes)
    .use(quizRoutes)
    .use(flashcardRoutes)
    .use(resourceRoutes)
    .use(noteRoutes)
    .use(searchRoutes)
    .get("/", () => ({
      message: "Welcome to Noteminds API",
      version: "1.0.0",
      docs: "/docs",
    }))
    .get("/health", () => ({
      status: "healthy",
      timestamp: new Date().toISOString(),
    }))
    .use(
      openapi({
        path: "/docs",
        references: fromTypes(),
        documentation: {
          components: await OpenAPI.components,
          paths: await OpenAPI.getPaths(),
          info: {
            title: "Noteminds API",
            version: "1.0.0",
            description: "Smart reading assistant API with AI-powered features",
          },
          tags: [
            {
              name: "Webpage",
              description: "Webpage analysis and content processing",
            },
            { name: "Summary", description: "AI-generated content summaries" },
            {
              name: "Quiz",
              description: "AI-generated quizzes and assessments",
            },
            { name: "Flashcard", description: "Spaced repetition flashcards" },
            {
              name: "Resources",
              description: "Related learning resources discovery",
            },
            { name: "AI", description: "AI-powered features" },
          ],
        },
      })
    )
    .listen(env.PORT, ({ hostname, port }) => {
      console.log(`🦊 Elysia is running at http://${hostname}:${port}`);
    });

  return app;
}

export type App = Awaited<ReturnType<typeof main>>;
main().catch((err) => {
  console.error(err);
  process.exit(1);
});

type hi = App["~Routes"]["webpage"]["GET /webpage/analyze"];

const client = treaty<App>("");
const fetch = edenFetch<App>("http://localhost:3000");
