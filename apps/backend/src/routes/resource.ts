import { createRouter } from "@/lib/create-app";
import { Elysia, t } from "elysia";

export const resourceRoutes = createRouter({ prefix: "/resource" })
  .post(
    "/generate",
    async ({ body, set }) => {
      try {
        const { webpageId, type, stream } = body;

        // TODO: Implement resource discovery with streaming
        set.status = 501;
        return {
          success: false,
          message: "Resource generation endpoint - coming soon",
          data: {
            webpageId,
            type,
            stream,
          },
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to generate resources",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      body: t.Object({
        webpageId: t.String(),
        type: t.Optional(
          t.Union([
            t.Literal("related_articles"),
            t.Literal("academic_papers"),
            t.Literal("video_content"),
            t.Literal("practice_materials"),
            t.Literal("all"),
          ])
        ),
        stream: t.Optional(t.Boolean()),
      }),
      detail: {
        summary: "Generate related resources from webpage content",
        description:
          "Find and suggest related learning resources based on webpage content",
        tags: ["AI", "Resources"],
      },
    }
  )
  .get(
    "/webpage/:webpageId",
    async ({ params, query, set }) => {
      try {
        const { webpageId } = params;
        const { type } = query;

        // TODO: Implement get resources for webpage
        set.status = 501;
        return {
          success: false,
          message: "Get webpage resources endpoint - coming soon",
          data: {
            webpageId,
            type,
          },
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to get resources",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      params: t.Object({
        webpageId: t.String(),
      }),
      query: t.Object({
        type: t.Optional(t.String()),
      }),
      detail: {
        summary: "Get resources for webpage",
        description: "Retrieve previously generated resources for a webpage",
        tags: ["Resources"],
      },
    }
  );
