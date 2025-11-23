import { createRouter } from "@/lib/create-app";
import { Elysia, t } from "elysia";
import { db, summary, userNote, flashcard, quiz } from "@/db";
import { eq, and, or, like, sql } from "drizzle-orm";

export const searchRoutes = createRouter({ prefix: "/search" })
  .get(
    "/",
    async ({ query, set, user }) => {
      try {
        const { q, type, limit = 50 } = query;

        if (!q || q.trim().length === 0) {
          set.status = 400;
          return {
            success: false,
            message: "Search query is required",
          };
        }

        const searchTerm = `%${q.trim()}%`;
        const searchLimit = Math.min(Number(limit), 100);

        // Build search results based on type filter
        const results: {
          summaries: any[];
          notes: any[];
          flashcards: any[];
          quizzes: any[];
        } = {
          summaries: [],
          notes: [],
          flashcards: [],
          quizzes: [],
        };

        // Search summaries
        if (!type || type === "summary") {
          results.summaries = await db
            .select()
            .from(summary)
            .where(
              and(
                eq(summary.createdBy, user.id),
                or(
                  like(summary.title, searchTerm),
                  like(summary.content, searchTerm)
                )
              )
            )
            .limit(searchLimit);
        }

        // Search notes
        if (!type || type === "note") {
          results.notes = await db
            .select()
            .from(userNote)
            .where(
              and(
                eq(userNote.userId, user.id),
                like(userNote.content, searchTerm)
              )
            )
            .limit(searchLimit);
        }

        // Search flashcards
        if (!type || type === "flashcard") {
          results.flashcards = await db
            .select()
            .from(flashcard)
            .where(
              and(
                eq(flashcard.userId, user.id),
                or(
                  like(flashcard.front, searchTerm),
                  like(flashcard.back, searchTerm)
                )
              )
            )
            .limit(searchLimit);
        }

        // Search quizzes
        if (!type || type === "quiz") {
          results.quizzes = await db
            .select()
            .from(quiz)
            .where(
              and(
                eq(quiz.userId, user.id),
                or(
                  like(quiz.title, searchTerm),
                  sql`${quiz.questions} LIKE ${searchTerm}`
                )
              )
            )
            .limit(searchLimit);
        }

        // Calculate total results
        const totalResults =
          results.summaries.length +
          results.notes.length +
          results.flashcards.length +
          results.quizzes.length;

        return {
          success: true,
          query: q,
          totalResults,
          data: results,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Search failed",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      query: t.Object({
        q: t.String({ minLength: 1 }),
        type: t.Optional(
          t.Union([
            t.Literal("summary"),
            t.Literal("note"),
            t.Literal("flashcard"),
            t.Literal("quiz"),
          ])
        ),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      }),
      detail: {
        summary: "Search across summaries, notes, flashcards, and quizzes",
        description:
          "Search for content across all user data with optional type filtering",
        tags: ["Search"],
      },
    }
  )
  .get(
    "/summaries",
    async ({ query, set, user }) => {
      try {
        const { q, limit = 20 } = query;

        if (!q || q.trim().length === 0) {
          set.status = 400;
          return {
            success: false,
            message: "Search query is required",
          };
        }

        const searchTerm = `%${q.trim()}%`;
        const searchLimit = Math.min(Number(limit), 100);

        const results = await db
          .select()
          .from(summary)
          .where(
            and(
              eq(summary.createdBy, user.id),
              or(
                like(summary.title, searchTerm),
                like(summary.content, searchTerm)
              )
            )
          )
          .limit(searchLimit);

        return {
          success: true,
          query: q,
          totalResults: results.length,
          data: results,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Summary search failed",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      query: t.Object({
        q: t.String({ minLength: 1 }),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      }),
      detail: {
        summary: "Search summaries",
        description: "Search for summaries by title or content",
        tags: ["Search", "Summary"],
      },
    }
  )
  .get(
    "/notes",
    async ({ query, set, user }) => {
      try {
        const { q, limit = 20 } = query;

        if (!q || q.trim().length === 0) {
          set.status = 400;
          return {
            success: false,
            message: "Search query is required",
          };
        }

        const searchTerm = `%${q.trim()}%`;
        const searchLimit = Math.min(Number(limit), 100);

        const results = await db
          .select()
          .from(userNote)
          .where(
            and(
              eq(userNote.userId, user.id),
              like(userNote.content, searchTerm)
            )
          )
          .limit(searchLimit);

        return {
          success: true,
          query: q,
          totalResults: results.length,
          data: results,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Note search failed",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      query: t.Object({
        q: t.String({ minLength: 1 }),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      }),
      detail: {
        summary: "Search notes",
        description: "Search for notes by content",
        tags: ["Search", "Note"],
      },
    }
  )
  .get(
    "/flashcards",
    async ({ query, set, user }) => {
      try {
        const { q, limit = 20 } = query;

        if (!q || q.trim().length === 0) {
          set.status = 400;
          return {
            success: false,
            message: "Search query is required",
          };
        }

        const searchTerm = `%${q.trim()}%`;
        const searchLimit = Math.min(Number(limit), 100);

        const results = await db
          .select()
          .from(flashcard)
          .where(
            and(
              eq(flashcard.userId, user.id),
              or(
                like(flashcard.front, searchTerm),
                like(flashcard.back, searchTerm)
              )
            )
          )
          .limit(searchLimit);

        return {
          success: true,
          query: q,
          totalResults: results.length,
          data: results,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Flashcard search failed",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      query: t.Object({
        q: t.String({ minLength: 1 }),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      }),
      detail: {
        summary: "Search flashcards",
        description: "Search for flashcards by front or back content",
        tags: ["Search", "Flashcard"],
      },
    }
  )
  .get(
    "/quizzes",
    async ({ query, set, user }) => {
      try {
        const { q, limit = 20 } = query;

        if (!q || q.trim().length === 0) {
          set.status = 400;
          return {
            success: false,
            message: "Search query is required",
          };
        }

        const searchTerm = `%${q.trim()}%`;
        const searchLimit = Math.min(Number(limit), 100);

        const results = await db
          .select()
          .from(quiz)
          .where(
            and(
              eq(quiz.userId, user.id),
              or(
                like(quiz.title, searchTerm),
                sql`${quiz.questions} LIKE ${searchTerm}`
              )
            )
          )
          .limit(searchLimit);

        return {
          success: true,
          query: q,
          totalResults: results.length,
          data: results,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Quiz search failed",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      query: t.Object({
        q: t.String({ minLength: 1 }),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
      }),
      detail: {
        summary: "Search quizzes",
        description: "Search for quizzes by title or questions",
        tags: ["Search", "Quiz"],
      },
    }
  );
