import { createRouter } from "@/lib/create-app";
import { Elysia, t } from "elysia";
import { db, flashcard, webpage } from "@/db";
import { and, desc, eq } from "drizzle-orm";

export const flashcardRoutes = createRouter({ prefix: "/flashcard" })
  .post(
    "/generate",
    async ({ body, set, user, aiService }) => {
      try {
        const { webpageId, count = 10 } = body;

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

        // Generate AI flashcards and return database records
        const flashcards = await aiService.generateFlashcards({
          webpageId,
          content: webpageRecord.extractedContent,
          count,
        });

        return {
          success: true,
          data: flashcards,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to generate flashcards",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      body: t.Object({
        webpageId: t.String(),
        count: t.Optional(t.Number({ minimum: 1, maximum: 20 })),
      }),
      detail: {
        summary: "Generate AI flashcards from webpage content",
        description:
          "Generate AI flashcards and return created database records",
        tags: ["AI", "Flashcard"],
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

        // Get all flashcards for this webpage
        const cards = await db.query.flashcard.findMany({
          where: and(
            eq(flashcard.webpageId, webpageId),
            eq(flashcard.userId, user.id)
          ),
          orderBy: [desc(flashcard.createdAt)],
        });

        return {
          success: true,
          data: cards,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to fetch flashcards",
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
        summary: "Get flashcards for a webpage",
        description: "Retrieve all flashcards created for a specific webpage",
        tags: ["Flashcard"],
      },
    }
  )
  .patch(
    "/:id/practice",
    async ({ params, set, user }) => {
      try {
        const { id } = params;

        // Find flashcard and verify ownership
        const card = await db.query.flashcard.findFirst({
          where: eq(flashcard.id, id),
        });

        if (!card) {
          set.status = 404;
          return {
            success: false,
            message: "Flashcard not found",
          };
        }

        if (card.userId !== user.id) {
          set.status = 403;
          return {
            success: false,
            message: "Unauthorized",
          };
        }

        // Increment practice count
        await db
          .update(flashcard)
          .set({
            practiceCount: card.practiceCount + 1,
          })
          .where(eq(flashcard.id, id));

        return {
          success: true,
          message: "Practice count updated",
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to update practice count",
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
        summary: "Increment flashcard practice count",
        description: "Record that a flashcard was practiced",
        tags: ["Flashcard"],
      },
    }
  )
  .delete(
    "/:id",
    async ({ params, set, user }) => {
      try {
        const { id } = params;

        // Find flashcard and verify ownership
        const card = await db.query.flashcard.findFirst({
          where: eq(flashcard.id, id),
        });

        if (!card) {
          set.status = 404;
          return {
            success: false,
            message: "Flashcard not found",
          };
        }

        if (card.userId !== user.id) {
          set.status = 403;
          return {
            success: false,
            message: "Unauthorized",
          };
        }

        // Delete flashcard
        await db.delete(flashcard).where(eq(flashcard.id, id));

        return {
          success: true,
          message: "Flashcard deleted",
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to delete flashcard",
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
        summary: "Delete a flashcard",
        description: "Remove a flashcard by ID",
        tags: ["Flashcard"],
      },
    }
  );
