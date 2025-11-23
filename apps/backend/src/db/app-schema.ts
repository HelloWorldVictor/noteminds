import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

// Webpage table - represents scraped web content
export const webpage = sqliteTable(
  "webpage",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    url: text("url").notNull(),
    title: text("title").notNull(),
    extractedContent: text("extracted_content").notNull(),
    contentHash: text("content_hash").notNull(), // For deduplication
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }), // Connect webpage to user
    metadata: text("metadata", { mode: "json" }).$type<{
      author?: string;
      publishedDate?: string;
      description?: string;
      wordCount?: number;
      readingTime?: number;
    }>(),
    scrapedAt: integer("scraped_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("webpage_url_idx").on(table.url),
    index("webpage_content_hash_idx").on(table.contentHash),
    index("webpage_scraped_at_idx").on(table.scrapedAt),
    index("webpage_created_by_idx").on(table.createdBy),
  ]
);

// Summary table - AI-generated summaries of webpages
export const summary = sqliteTable(
  "summary",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    webpageId: text("webpage_id")
      .notNull()
      .references(() => webpage.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    type: text("type", { enum: ["brief", "detailed", "bullet_points"] })
      .default("brief")
      .notNull(),
    wordCount: integer("word_count").notNull(),
    metadata: text("metadata", { mode: "json" }).$type<{
      model?: string;
      processingTime?: number;
      confidence?: number;
    }>(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("summary_created_by_idx").on(table.createdBy),
    index("summary_webpage_id_idx").on(table.webpageId),
    index("summary_type_idx").on(table.type),
    index("summary_created_at_idx").on(table.createdAt),
    index("summary_created_by_webpage_idx").on(
      table.createdBy,
      table.webpageId
    ),
  ]
);

// Quiz table - simple quiz with embedded questions
export const quiz = sqliteTable(
  "quiz",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    webpageId: text("webpage_id")
      .notNull()
      .references(() => webpage.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    questions: text("questions", { mode: "json" }).notNull().$type<
      Array<{
        question: string;
        options: string[];
        correctAnswer: string;
      }>
    >(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("quiz_user_id_idx").on(table.userId),
    index("quiz_webpage_id_idx").on(table.webpageId),
    index("quiz_created_at_idx").on(table.createdAt),
    index("quiz_user_webpage_idx").on(table.userId, table.webpageId),
  ]
);

// Flashcard table - simple flashcards for learning
export const flashcard = sqliteTable(
  "flashcard",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    webpageId: text("webpage_id")
      .notNull()
      .references(() => webpage.id, { onDelete: "cascade" }),
    front: text("front").notNull(), // The question/prompt
    back: text("back").notNull(), // The answer
    practiceCount: integer("practice_count").notNull().default(0), // How many times reviewed
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("flashcard_user_id_idx").on(table.userId),
    webpageIdIdx: index("flashcard_webpage_id_idx").on(table.webpageId),
    createdAtIdx: index("flashcard_created_at_idx").on(table.createdAt),
    userWebpageIdx: index("flashcard_user_webpage_idx").on(
      table.userId,
      table.webpageId
    ),
  })
);

// User notes table - simple personal notes on webpages
export const userNote = sqliteTable(
  "user_note",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    webpageId: text("webpage_id")
      .notNull()
      .references(() => webpage.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("user_note_user_id_idx").on(table.userId),
    index("user_note_webpage_id_idx").on(table.webpageId),
    index("user_note_created_at_idx").on(table.createdAt),
    index("user_note_user_webpage_idx").on(table.userId, table.webpageId),
  ]
);

// User preferences table - user settings and preferences
export const userPreference = sqliteTable(
  "user_preference",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" })
      .unique(),
    summaryPreferences: text("summary_preferences", { mode: "json" }).$type<{
      defaultType: "brief" | "detailed" | "bullet_points";
      autoGenerate: boolean;
      language: string;
    }>(),
    quizPreferences: text("quiz_preferences", { mode: "json" }).$type<{
      defaultDifficulty: "easy" | "medium" | "hard";
      defaultQuestionCount: number;
      autoGenerate: boolean;
      questionTypes: string[];
    }>(),
    flashcardPreferences: text("flashcard_preferences", {
      mode: "json",
    }).$type<{
      autoGenerate: boolean;
      reviewReminders: boolean;
      maxDailyReviews: number;
      preferredDifficulty: "easy" | "medium" | "hard";
    }>(),
    uiPreferences: text("ui_preferences", { mode: "json" }).$type<{
      theme: "light" | "dark" | "system";
      fontSize: "small" | "medium" | "large";
      sidebarPosition: "left" | "right";
    }>(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("user_preference_user_id_idx").on(table.userId)]
);

// Library table - user's saved resources and collections
export const library = sqliteTable(
  "library",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    itemType: text("item_type", {
      enum: ["webpage", "summary", "quiz", "flashcard", "external_link"],
    }).notNull(),
    itemId: text("item_id"), // References the actual content (can be null for external links)
    title: text("title").notNull(),
    url: text("url"), // For external links or webpage URLs
    tags: text("tags", { mode: "json" }).$type<string[]>(),
    notes: text("notes"), // Personal notes about this library item
    savedAt: integer("saved_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("library_user_id_idx").on(table.userId),
    index("library_item_type_idx").on(table.itemType),
    index("library_saved_at_idx").on(table.savedAt),
    index("library_user_type_idx").on(table.userId, table.itemType),
  ]
);

// Export all tables and types
export type WebpageInsert = typeof webpage.$inferInsert;
export type WebpageSelect = typeof webpage.$inferSelect;

export type SummaryInsert = typeof summary.$inferInsert;
export type SummarySelect = typeof summary.$inferSelect;

export type QuizInsert = typeof quiz.$inferInsert;
export type QuizSelect = typeof quiz.$inferSelect;

export type FlashcardInsert = typeof flashcard.$inferInsert;
export type FlashcardSelect = typeof flashcard.$inferSelect;

export type UserNoteInsert = typeof userNote.$inferInsert;
export type UserNoteSelect = typeof userNote.$inferSelect;

export type UserPreferenceInsert = typeof userPreference.$inferInsert;
export type UserPreferenceSelect = typeof userPreference.$inferSelect;

export type LibraryInsert = typeof library.$inferInsert;
export type LibrarySelect = typeof library.$inferSelect;
