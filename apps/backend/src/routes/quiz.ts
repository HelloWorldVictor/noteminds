// This file defines the quiz routes.
// It creates a router with the prefix '/quiz' and provides endpoints for generating quizzes, retrieving a quiz, and submitting attempts.
import { createRouter } from "@/lib/create-app";
import { Elysia, t } from "elysia";
import { db, quiz, webpage } from "@/db";
import { and, desc, eq } from "drizzle-orm";

// Define the router for quiz related endpoints.
export const quizRoutes = createRouter({ prefix: "/quiz" })
  // POST /generate: generate a quiz (currently a placeholder).
  .post(
    "/generate",
    async ({ body, set, user, aiService }) => {
      try {
        const { webpageId, questionCount = 5 } = body;

        // Verify webpage exists and user owns it
        const webpageRecord = await db.query.webpage.findFirst({
          where: and(eq(webpage.id, webpageId), eq(webpage.createdBy, user.id)),
        });

        if (!webpageRecord) {
          set.status = 404;
          return {
            success: false,
            message: "Webpage not found",
          };
        }

        // Generate AI quiz and return database record
        const quiz = await aiService.generateQuiz({
          webpageId,
          content: webpageRecord.extractedContent,
          questionCount,
        });

        return {
          success: true,
          data: quiz,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to generate quiz",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      body: t.Object({
        webpageId: t.String(),
        questionCount: t.Optional(t.Number({ minimum: 1, maximum: 20 })),
      }),
      detail: {
        summary: "Generate AI quiz from webpage content",
        description: "Generate AI quiz and return created database record",
        tags: ["AI", "Quiz"],
      },
    }
  )
  .get(
    "/webpage/:webpageId",
    async ({ params, set, user }) => {
      try {
        const { webpageId } = params;

        // Verify webpage exists
        const webpageRecord = await db.query.webpage.findFirst({
          where: and(eq(webpage.id, webpageId), eq(webpage.createdBy, user.id)),
        });

        if (!webpageRecord) {
          set.status = 404;
          return {
            success: false,
            message: "Webpage not found",
            data: [],
          };
        }

        // Get all quizzes for this webpage
        const quizzes = await db.query.quiz.findMany({
          where: and(eq(quiz.webpageId, webpageId), eq(quiz.userId, user.id)),
          orderBy: [desc(quiz.createdAt)],
        });

        return {
          success: true,
          data: quizzes,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to fetch quizzes",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        webpageId: t.String(),
      }),
      detail: {
        summary: "Get quizzes for a webpage",
        description: "Retrieve all quizzes created for a specific webpage",
        tags: ["Quiz"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params, set, user }) => {
      try {
        const { id } = params;

        // Find quiz and verify ownership
        const quizRecord = await db.query.quiz.findFirst({
          where: eq(quiz.id, id),
        });

        if (!quizRecord) {
          set.status = 404;
          return {
            success: false,
            message: "Quiz not found",
          };
        }

        if (quizRecord.userId !== user.id) {
          set.status = 403;
          return {
            success: false,
            message: "Unauthorized",
          };
        }

        return {
          success: true,
          data: quizRecord,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to get quiz",
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
        summary: "Get quiz by ID",
        description: "Retrieve a quiz with its questions by ID",
        tags: ["Quiz"],
      },
    }
  )
  .delete(
    "/:id",
    async ({ params, set, user }) => {
      try {
        const { id } = params;

        // Find quiz and verify ownership
        const quizRecord = await db.query.quiz.findFirst({
          where: eq(quiz.id, id),
        });

        if (!quizRecord) {
          set.status = 404;
          return {
            success: false,
            message: "Quiz not found",
          };
        }

        if (quizRecord.userId !== user.id) {
          set.status = 403;
          return {
            success: false,
            message: "Unauthorized",
          };
        }

        // Delete quiz
        await db.delete(quiz).where(eq(quiz.id, id));

        return {
          success: true,
          message: "Quiz deleted",
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to delete quiz",
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
        summary: "Delete a quiz",
        description: "Remove a quiz by ID",
        tags: ["Quiz"],
      },
    }
  );
