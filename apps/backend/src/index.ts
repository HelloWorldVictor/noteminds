import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { node } from "@elysiajs/node";
import { auth, OpenAPI } from "@/lib/auth";
import { cors } from "@elysiajs/cors";
import {
  webpageRoutes,
  summaryRoutes,
  quizRoutes,
  flashcardRoutes,
  resourceRoutes,
} from "@/routes";

async function main() {
  const components = await OpenAPI.components;
  const paths = await OpenAPI.getPaths();

  const app = new Elysia({
    adapter: node(),
  })
    .use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    )
    .mount("/auth", auth.handler)
    .use(
      openapi({
        path: "/docs",
        documentation: {
          components,
          paths,
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
    .listen(4137, ({ hostname, port }) => {
      console.log(`🦊 Elysia is running at http://${hostname}:${port}`);
    });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
