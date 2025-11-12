import { ElysiaRouter, type ElysiaApp } from "./create-app";
import { openapi } from "@elysiajs/openapi";
import { OpenAPI } from "./auth";

export async function configureOpenAPI(app: ElysiaRouter) {
  const components = await OpenAPI.components;
  const paths = await OpenAPI.getPaths();
  app.use(
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
  );
}
