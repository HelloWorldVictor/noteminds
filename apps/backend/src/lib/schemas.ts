import { z } from "zod";

// Schemas for structured AI outputs - exported separately to avoid database dependencies
export const summarySchema = z.object({
  title: z.string().describe("A concise title for the summary"),
  content: z.string().describe("The main summary content"),
});

export const quizSchema = z.object({
  title: z.string().describe("Title for the quiz"),
  questions: z
    .array(
      z.object({
        question: z.string().describe("The question text"),
        options: z.array(z.string()).describe("Answer options (4 options)"),
        correctAnswer: z.string().describe("The correct answer"),
      })
    )
    .min(1)
    .max(20)
    .describe("Array of quiz questions"),
});

export const flashcardSchema = z.object({
  flashcards: z
    .array(
      z.object({
        front: z.string().describe("The question or prompt"),
        back: z.string().describe("The answer or explanation"),
      })
    )
    .min(1)
    .max(30)
    .describe("Array of flashcards"),
});

export const noteSchema = z.object({
  content: z.string().describe("The note content"),
});
