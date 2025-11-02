import { Elysia, t } from "elysia";

export const summaryRoutes = new Elysia({ prefix: "/summary" })
  .post(
    "/generate",
    async ({ body, set }) => {
      try {
        const { webpageId, type, stream } = body;

        // TODO: Implement summary generation with streaming
        set.status = 501;
        return {
          success: false,
          message: "Summary generation endpoint - coming soon",
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
          message: "Failed to generate summary",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      body: t.Object({
        webpageId: t.String(),
        type: t.Optional(
          t.Union([
            t.Literal("brief"),
            t.Literal("detailed"),
            t.Literal("bullet_points"),
          ])
        ),
        stream: t.Optional(t.Boolean()),
      }),
      detail: {
        summary: "Generate AI summary of webpage content",
        description:
          "Create a summary of the webpage content with optional streaming",
        tags: ["AI", "Summary"],
      },
    }
  )
  .get(
    "/user/:userId",
    async ({ params, query, set }) => {
      try {
        const { userId } = params;
        const { limit = 10, offset = 0 } = query;

        // TODO: Implement get user summaries
        set.status = 501;
        return {
          success: false,
          message: "Get user summaries endpoint - coming soon",
          data: {
            userId,
            limit,
            offset,
          },
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to get summaries",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      params: t.Object({
        userId: t.String(),
      }),
      query: t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
      }),
      detail: {
        summary: "Get user's summaries",
        description: "Retrieve summaries created by a specific user",
        tags: ["Summary"],
      },
    }
  );
