import { createRouter } from "@/lib/create-app";
import { Elysia, t } from "elysia";
import { db, userNote, webpage } from "@/db";
import { and, desc, eq } from "drizzle-orm";

export const noteRoutes = createRouter({ prefix: "/note" })
  .post(
    "/",
    async ({ body, set, user }) => {
      try {
        const { webpageId, content } = body;

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

        // Create note
        const [note] = await db
          .insert(userNote)
          .values({
            userId: user.id,
            webpageId,
            content,
          })
          .returning();

        return {
          success: true,
          data: note,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to create note",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      body: t.Object({
        webpageId: t.String(),
        content: t.String({ minLength: 1 }),
      }),
      detail: {
        summary: "Create a note for a webpage",
        description: "Create a personal note attached to a webpage",
        tags: ["Note"],
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

        // Get all notes for this webpage
        const notes = await db.query.userNote.findMany({
          where: and(
            eq(userNote.webpageId, webpageId),
            eq(userNote.userId, user.id)
          ),
          orderBy: [desc(userNote.createdAt)],
        });

        return {
          success: true,
          data: notes,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to fetch notes",
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
        summary: "Get notes for a webpage",
        description: "Retrieve all notes created for a specific webpage",
        tags: ["Note"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params, set, user }) => {
      try {
        const { id } = params;

        const note = await db.query.userNote.findFirst({
          where: eq(userNote.id, id),
        });

        if (!note) {
          set.status = 404;
          return {
            success: false,
            message: "Note not found",
          };
        }

        if (note.userId !== user.id) {
          set.status = 403;
          return {
            success: false,
            message: "Unauthorized",
          };
        }

        return {
          success: true,
          data: note,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to fetch note",
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
        summary: "Get a single note",
        description: "Retrieve a note by ID",
        tags: ["Note"],
      },
    }
  )
  .patch(
    "/:id",
    async ({ params, body, set, user }) => {
      try {
        const { id } = params;
        const { content } = body;

        // Find note and verify ownership
        const note = await db.query.userNote.findFirst({
          where: eq(userNote.id, id),
        });

        if (!note) {
          set.status = 404;
          return {
            success: false,
            message: "Note not found",
          };
        }

        if (note.userId !== user.id) {
          set.status = 403;
          return {
            success: false,
            message: "Unauthorized",
          };
        }

        // Update note
        const [updatedNote] = await db
          .update(userNote)
          .set({
            content,
            updatedAt: new Date(),
          })
          .where(eq(userNote.id, id))
          .returning();

        return {
          success: true,
          data: updatedNote,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to update note",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      auth: true,
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        content: t.String({ minLength: 1 }),
      }),
      detail: {
        summary: "Update a note",
        description: "Update the content of a note",
        tags: ["Note"],
      },
    }
  )
  .delete(
    "/:id",
    async ({ params, set, user }) => {
      try {
        const { id } = params;

        // Find note and verify ownership
        const note = await db.query.userNote.findFirst({
          where: eq(userNote.id, id),
        });

        if (!note) {
          set.status = 404;
          return {
            success: false,
            message: "Note not found",
          };
        }

        if (note.userId !== user.id) {
          set.status = 403;
          return {
            success: false,
            message: "Unauthorized",
          };
        }

        // Delete note
        await db.delete(userNote).where(eq(userNote.id, id));

        return {
          success: true,
          message: "Note deleted",
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to delete note",
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
        summary: "Delete a note",
        description: "Remove a note by ID",
        tags: ["Note"],
      },
    }
  );
