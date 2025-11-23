// This file defines the main application database tables.
// It includes tables for webpages, summaries, quizzes, flashcards, and user notes.
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
    index("summary_created_by_webpage_idx").on(table.createdBy, table.webpageId),
  ]
);

// Quiz table - contains quiz metadata
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
    description: text("description"),
    difficulty: text("difficulty", {
      enum: ["easy", "medium", "hard"],
    })
      .default("medium")
      .notNull(),
    totalQuestions: integer("total_questions").notNull().default(0),
    estimatedDuration: integer("estimated_duration").notNull(), // in minutes
    metadata: text("metadata", { mode: "json" }).$type<{
      model?: string;
      tags?: string[];
      category?: string;
    }>(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("quiz_user_id_idx").on(table.userId),
    index("quiz_webpage_id_idx").on(table.webpageId),
    index("quiz_difficulty_idx").on(table.difficulty),
    index("quiz_created_at_idx").on(table.createdAt),
    index("quiz_user_webpage_idx").on(table.userId, table.webpageId),
  ]
);

// Question table - individual questions within quizzes
export const question = sqliteTable(
  "question",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    questionText: text("question_text").notNull(),
    questionType: text("question_type", {
      enum: ["multiple_choice", "true_false", "short_answer", "essay"],
    })
      .default("multiple_choice")
      .notNull(),
    options: text("options", { mode: "json" }).$type<string[]>(), // Array of answer options
    correctAnswer: text("correct_answer").notNull(),
    explanation: text("explanation"), // Explanation for the correct answer
    points: integer("points").notNull().default(1),
    orderIndex: integer("order_index").notNull(),
    metadata: text("metadata", { mode: "json" }).$type<{
      difficulty?: string;
      topic?: string;
      keywords?: string[];
    }>(),
  },
  (table) => [
    index("question_quiz_id_idx").on(table.quizId),
    index("question_type_idx").on(table.questionType),
    index("question_order_idx").on(table.quizId, table.orderIndex),
  ]
);

// Flashcard table - spaced repetition flashcards
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
    front: text("front").notNull(),
    back: text("back").notNull(),
    tags: text("tags", { mode: "json" }).$type<string[]>(),
    difficulty: text("difficulty", {
      enum: ["easy", "medium", "hard"],
    })
      .default("medium")
      .notNull(),
    // Spaced repetition fields
    repetitions: integer("repetitions").notNull().default(0),
    easeFactor: integer("ease_factor").notNull().default(2500), // SM-2 algorithm
    interval: integer("interval").notNull().default(1), // days
    nextReview: integer("next_review", { mode: "timestamp_ms" }),
    lastReviewed: integer("last_reviewed", { mode: "timestamp_ms" }),
    metadata: text("metadata", { mode: "json" }).$type<{
      category?: string;
      source?: string;
      model?: string;
    }>(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("flashcard_user_id_idx").on(table.userId),
    webpageIdIdx: index("flashcard_webpage_id_idx").on(table.webpageId),
    difficultyIdx: index("flashcard_difficulty_idx").on(table.difficulty),
    nextReviewIdx: index("flashcard_next_review_idx").on(table.nextReview),
    createdAtIdx: index("flashcard_created_at_idx").on(table.createdAt),
    userWebpageIdx: index("flashcard_user_webpage_idx").on(
      table.userId,
      table.webpageId
    ),
  })
);

// Quiz attempt table - tracks user attempts at quizzes
export const quizAttempt = sqliteTable(
  "quiz_attempt",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    totalQuestions: integer("total_questions").notNull(),
    timeSpent: integer("time_spent").notNull(), // in seconds
    completed: integer("completed", { mode: "boolean" })
      .default(true)
      .notNull(),
    answers: text("answers", { mode: "json" }).$type<
      Record<string, string | string[]>
    >(), // questionId -> user's answer(s)
    startedAt: integer("started_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    completedAt: integer("completed_at", { mode: "timestamp_ms" }),
  },
  (table) => [
    index("quiz_attempt_user_id_idx").on(table.userId),
    index("quiz_attempt_quiz_id_idx").on(table.quizId),
    index("quiz_attempt_completed_idx").on(table.completed),
    index("quiz_attempt_started_at_idx").on(table.startedAt),
    index("quiz_attempt_user_quiz_idx").on(table.userId, table.quizId),
  ]
);

// User notes table - personal notes on webpages
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
    isPrivate: integer("is_private", { mode: "boolean" })
      .default(true)
      .notNull(),
    tags: text("tags", { mode: "json" }).$type<string[]>(),
    // Text selection/highlight info
    selectedText: text("selected_text"),
    selectionPosition: text("selection_position", { mode: "json" }).$type<{
      start: number;
      end: number;
      xpath?: string;
    }>(),
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
    index("user_note_is_private_idx").on(table.isPrivate),
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

export type QuestionInsert = typeof question.$inferInsert;
export type QuestionSelect = typeof question.$inferSelect;

export type FlashcardInsert = typeof flashcard.$inferInsert;
export type FlashcardSelect = typeof flashcard.$inferSelect;

export type QuizAttemptInsert = typeof quizAttempt.$inferInsert;
export type QuizAttemptSelect = typeof quizAttempt.$inferSelect;

export type UserNoteInsert = typeof userNote.$inferInsert;
export type UserNoteSelect = typeof userNote.$inferSelect;

export type UserPreferenceInsert = typeof userPreference.$inferInsert;
export type UserPreferenceSelect = typeof userPreference.$inferSelect;

export type LibraryInsert = typeof library.$inferInsert;
export type LibrarySelect = typeof library.$inferSelect;
