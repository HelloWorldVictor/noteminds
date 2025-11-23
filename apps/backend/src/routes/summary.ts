// This file defines the summary routes.
// It creates a router with the prefix '/summary' and provides endpoints for generating and retrieving summaries.
import { createRouter } from "@/lib/create-app";
import { Elysia, t } from "elysia";
import { db, summary, webpage } from "@/db";
import { eq, and } from "drizzle-orm";

export const summaryRoutes = createRouter({ prefix: "/summary" })
  // POST /generate: generate a summary (placeholder).
.post(
    "/generate",
    async ({ body, set, user, aiService }) => {
      try {
        const { webpageId, type } = body;
        const page = await db.query.webpage.findFirst({
          where: and(eq(webpage.id, webpageId), eq(webpage.createdBy, user.id)),
        });
        console.log("Found webpage for summary:", page);
        if (!page) {
          set.status = 404;
          return {
            success: false,
            message: "Webpage not found",
          };
        }
        const result = await aiService.generateSummary({
          webpageId,
          content: page.extractedContent,
          type,
        });

        return result.toTextStreamResponse();
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
      auth: true,
      body: t.Object({
        webpageId: t.String(),
        type: t.Optional(
          t.Union([
            t.Literal("brief"),
            t.Literal("detailed"),
            t.Literal("bullet_points"),
          ])
        ),
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
    "/webpage/:webpageId",
    async ({ params, query, set, user }) => {
      try {
        const { webpageId } = params;
        const { type } = query;

        // Check if webpage exists and belongs to user
        const page = await db.query.webpage.findFirst({
          where: and(eq(webpage.id, webpageId), eq(webpage.createdBy, user.id)),
        });

        if (!page) {
          set.status = 404;
          return {
            success: false,
            message: "Webpage not found",
          };
        }

        const conditions = [
          eq(summary.webpageId, webpageId),
          eq(summary.createdBy, user.id),
        ];

        if (type) {
          conditions.push(eq(summary.type, type));
        }

        const summaries = await db.query.summary.findMany({
          where: and(...conditions),
          orderBy: (summary, { desc }) => [desc(summary.createdAt)],
        });

        return {
          success: true,
          data: summaries,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to get webpage summaries",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        webpageId: t.String(),
      }),
      query: t.Object({
        type: t.Optional(
          t.Union([
            t.Literal("brief"),
            t.Literal("detailed"),
            t.Literal("bullet_points"),
          ])
        ),
      }),
      detail: {
        summary: "Get summaries for a specific webpage",
        description:
          "Retrieve all summaries created for a specific webpage, optionally filtered by type",
        tags: ["Summary"],
      },
    }
  )
  .get(
    "/user/:userId",
    async ({ params, query, set, user }) => {
      try {
        const { userId } = params;

        // Ensure user can only access their own summaries
        if (userId !== user.id) {
          set.status = 403;
          return {
            success: false,
            message: "Forbidden: Cannot access other users' summaries",
          };
        }

        const { limit = 10, offset = 0, webpageId, type } = query;

        const conditions = [eq(summary.createdBy, userId)];

        if (webpageId) {
          // Check if webpage exists and belongs to user
          const page = await db.query.webpage.findFirst({
            where: and(
              eq(webpage.id, webpageId),
              eq(webpage.createdBy, user.id)
            ),
          });

          if (!page) {
            set.status = 404;
            return {
              success: false,
              message: "Webpage not found",
            };
          }

          conditions.push(eq(summary.webpageId, webpageId));
        }

        if (type) {
          conditions.push(eq(summary.type, type));
        }

        const summaries = await db.query.summary.findMany({
          where: and(...conditions),
          limit: Number(limit),
          offset: Number(offset),
          orderBy: (summary, { desc }) => [desc(summary.createdAt)],
          with: {
            webpage: {
              columns: {
                id: true,
                title: true,
                url: true,
              },
            },
          },
        });

        return {
          success: true,
          data: summaries,
          pagination: {
            limit: Number(limit),
            offset: Number(offset),
            total: summaries.length,
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
      auth: true,
      params: t.Object({
        userId: t.String(),
      }),
      query: t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
        webpageId: t.Optional(t.String()),
        type: t.Optional(
          t.Union([
            t.Literal("brief"),
            t.Literal("detailed"),
            t.Literal("bullet_points"),
          ])
        ),
      }),
      detail: {
        summary: "Get user's summaries",
        description:
          "Retrieve summaries created by a specific user, optionally filtered by webpage or type",
        tags: ["Summary"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params, set, user }) => {
      try {
        const { id } = params;

        const summaryRecord = await db.query.summary.findFirst({
          where: and(eq(summary.id, id), eq(summary.createdBy, user.id)),
          with: {
            webpage: {
              columns: {
                id: true,
                title: true,
                url: true,
              },
            },
          },
        });

        if (!summaryRecord) {
          set.status = 404;
          return {
            success: false,
            message: "Summary not found",
          };
        }

        return {
          success: true,
          data: summaryRecord,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to get summary",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Get summary by ID",
        description: "Retrieve a specific summary by its unique ID",
        tags: ["Summary"],
      },
    }
  )
  .delete(
    "/:id",
    async ({ params, set, user }) => {
      try {
        const { id } = params;

        // Check if summary exists and belongs to user
        const summaryRecord = await db.query.summary.findFirst({
          where: and(eq(summary.id, id), eq(summary.createdBy, user.id)),
        });

        if (!summaryRecord) {
          set.status = 404;
          return {
            success: false,
            message:
              "Summary not found or you don't have permission to delete it",
          };
        }

        await db.delete(summary).where(eq(summary.id, id));

        return {
          success: true,
          message: "Summary deleted successfully",
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to delete summary",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Delete summary by ID",
        description:
          "Delete a specific summary by its ID (user must own the summary)",
        tags: ["Summary"],
      },
    }
  )
  .delete(
    "/webpage/:webpageId",
    async ({ params, body, set, user }) => {
      try {
        const { webpageId } = params;
        const { type } = body;

        // Check if webpage exists and belongs to user
        const page = await db.query.webpage.findFirst({
          where: and(eq(webpage.id, webpageId), eq(webpage.createdBy, user.id)),
        });

        if (!page) {
          set.status = 404;
          return {
            success: false,
            message: "Webpage not found",
          };
        }

        const conditions = [
          eq(summary.webpageId, webpageId),
          eq(summary.createdBy, user.id),
        ];

        if (type) {
          conditions.push(eq(summary.type, type));
        }

        const result = await db
          .delete(summary)
          .where(and(...conditions))
          .returning();

        return {
          success: true,
          message: `Deleted ${result.length} summary(ies) successfully`,
          data: {
            deletedCount: result.length,
          },
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to delete webpage summaries",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        webpageId: t.String(),
      }),
      body: t.Object({
        type: t.Optional(
          t.Union([
            t.Literal("brief"),
            t.Literal("detailed"),
            t.Literal("bullet_points"),
          ])
        ),
      }),
      detail: {
        summary: "Delete summaries for a webpage",
        description:
          "Delete all summaries for a specific webpage (optionally filtered by type) that belong to the user",
        tags: ["Summary"],
      },
    }
  );
