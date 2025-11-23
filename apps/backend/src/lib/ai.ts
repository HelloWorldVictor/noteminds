// This file provides AI service utilities.
// It defines schemas for summaries, quizzes, flashcards, and resources, and a class that wraps calls to the Gemini model.
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";
import type { LanguageModel } from "ai";
import { db, summary } from "@/db";

export const aiModel: LanguageModel = google("gemini-2.0-flash-lite");

// Schemas for structured AI outputs
export const summarySchema = z.object({
  title: z.string().describe("A concise title for the summary"),
  content: z.string().describe("The main summary content"),
});

export const quizSchema = z.object({
  title: z.string().describe("Title for the quiz"),
  description: z.string().describe("Brief description of what the quiz covers"),
  questions: z.array(
    z.object({
      questionText: z.string().describe("The question text"),
      questionType: z
        .enum(["multiple_choice", "true_false"])
        .describe("Type of question"),
      options: z
        .array(z.string())
        .describe("Answer options (for multiple choice)"),
      correctAnswer: z.string().describe("The correct answer"),
      explanation: z.string().describe("Explanation of why this is correct"),
      difficulty: z
        .enum(["easy", "medium", "hard"])
        .describe("Question difficulty"),
    })
  ),
});

export const flashcardSchema = z.object({
  cards: z.array(
    z.object({
      front: z.string().describe("Front of the flashcard (question/prompt)"),
      back: z.string().describe("Back of the flashcard (answer/explanation)"),
      tags: z.array(z.string()).describe("Tags for categorization"),
      difficulty: z
        .enum(["easy", "medium", "hard"])
        .describe("Card difficulty"),
    })
  ),
});

export const resourceSchema = z.object({
  resources: z.array(
    z.object({
      title: z.string().describe("Resource title"),
      description: z.string().describe("Brief description of the resource"),
      url: z.string().describe("URL to the resource"),
      type: z
        .enum([
          "article",
          "video",
          "academic_paper",
          "tutorial",
          "documentation",
          "course",
        ])
        .describe("Type of resource"),
      relevanceScore: z
        .number()
        .min(0)
        .max(1)
        .describe("How relevant this resource is (0-1)"),
    })
  ),
});
// AI service class
export class AIService {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    console.log(`[AI Service] Instance created for user: ${userId}`);
  }

  /**
   * Generate a summary with streaming support
   */
  async generateSummary({
    webpageId,
    content,
    type = "brief",
    systemPrompt = "You are an AI assistant that helps generate concise and clear summaries of educational content. Focus on extracting key information, main ideas, and important details while maintaining clarity and educational value.",
  }: {
    webpageId: string;
    content: string;
    type?: "brief" | "detailed" | "bullet_points";
    systemPrompt?: string;
  }) {
    console.log(`[AI Service] Generating summary for user: ${this.userId}`);
    const prompt = this.buildSummaryPrompt(content, type);

    const createdBy = this.userId;

    return streamObject({
      model: aiModel,
      schema: summarySchema,
      prompt,
      system: systemPrompt,
      temperature: 0.3,
      onFinish({ object }) {
        if (!object) {
          return;
        }
        db.insert(summary).values({
          webpageId,
          title: object.title,
          content: object.content,
          createdBy,
          type,
          wordCount: object.content.split(" ").length,
          metadata: {
            model: "gemini-2.0-flash-lite",
          },
        });
      },
    });
  }

  /**
   * Generate quiz questions with streaming support
   */
  async generateQuiz({
    content,
    difficulty = "medium",
    questionCount = 5,
    systemPrompt = "You are an AI assistant that creates educational quiz questions. Generate questions that test understanding and critical thinking, not just memorization. Provide clear explanations for correct answers and ensure questions are relevant to the learning objectives.",
  }: {
    content: string;
    difficulty?: "easy" | "medium" | "hard";
    questionCount?: number;
    systemPrompt?: string;
  }) {
    console.log(`[AI Service] Generating quiz for user: ${this.userId}`);
    const prompt = this.buildQuizPrompt(content, difficulty, questionCount);

    return streamObject({
      model: aiModel,
      schema: quizSchema,
      prompt,
      system: systemPrompt,
      temperature: 0.4,
    });
  }

  /**
   * Generate flashcards with streaming support
   */
  async generateFlashcards({
    content,
    count = 10,
    difficulty = "medium",
    systemPrompt = "You are an AI assistant that creates educational flashcards for spaced repetition learning. Design cards that promote active recall, with clear questions on the front and concise but complete answers on the back.",
  }: {
    content: string;
    count?: number;
    difficulty?: "easy" | "medium" | "hard";
    systemPrompt?: string;
  }) {
    console.log(`[AI Service] Generating flashcards for user: ${this.userId}`);
    const prompt = this.buildFlashcardPrompt(content, count, difficulty);

    return streamObject({
      model: aiModel,
      schema: flashcardSchema,
      prompt,
      system: systemPrompt,
      temperature: 0.4,
    });
  }

  /**
   * Generate related resources
   */
  async generateResources({
    content,
    title,
    systemPrompt = "You are an AI assistant that recommends high-quality educational resources. Suggest relevant articles, videos, papers, tutorials, and courses that complement and expand on the given content. Focus on accessible, free, and widely available resources.",
  }: {
    content: string;
    title: string;
    systemPrompt?: string;
  }) {
    console.log(`[AI Service] Generating resources for user: ${this.userId}`);
    const prompt = this.buildResourcePrompt(content, title);

    return streamObject({
      model: aiModel,
      schema: resourceSchema,
      prompt,
      system: systemPrompt,
      temperature: 0.6,
    });
  }

  // Private methods for building prompts
  private buildSummaryPrompt(content: string, type: string): string {
    const typeInstructions = {
      brief:
        "Create a concise summary in 2-3 paragraphs that captures the main points.",
      detailed:
        "Create a comprehensive summary that covers all important aspects and details.",
      bullet_points:
        "Create a summary using bullet points to highlight key information.",
    };

    return `
Please create a ${type} summary of the following content:

${content}

Instructions:
- ${typeInstructions[type as keyof typeof typeInstructions]}
- Focus on the most important information
- Make it clear and easy to understand
- Include 3-5 key takeaways
- Keep the language accessible

Generate a structured summary with a title, main content, and key points.
`;
  }

  private buildQuizPrompt(
    content: string,
    difficulty: string,
    count: number
  ): string {
    return `
Create ${count} ${difficulty} quiz questions based on the following content:

${content}

Instructions:
- Create questions that test understanding, not just memorization
- Include both multiple choice and true/false questions
- Provide clear explanations for correct answers
- Make sure questions are relevant to the main concepts
- Vary the difficulty appropriately for ${difficulty} level
- Focus on key learning objectives

Generate a structured quiz with title, description, and questions.
`;
  }

  private buildFlashcardPrompt(
    content: string,
    count: number,
    difficulty: string
  ): string {
    return `
Create ${count} flashcards at ${difficulty} difficulty level based on the following content:

${content}

Instructions:
- Create cards that promote active recall
- Front should have clear, specific questions or prompts
- Back should have concise but complete answers
- Include relevant tags for organization
- Cover the most important concepts
- Make cards appropriate for ${difficulty} level study

Generate flashcards that will help with spaced repetition learning.
`;
  }

  private buildResourcePrompt(content: string, title: string): string {
    return `
Based on the content titled "${title}" below, suggest 5-8 related learning resources:

${content}

Instructions:
- Find resources that complement and expand on this content
- Include various types: articles, videos, academic papers, tutorials, courses
- Provide real, accessible URLs when possible
- Rate relevance on a scale of 0-1
- Focus on high-quality, educational resources
- Prioritize free and widely available resources

Suggest resources that would help someone learn more about these topics.
`;
  }
}
