import { google } from "@ai-sdk/google";
import { generateObject, generateText, streamText } from "ai";
import { z } from "zod";
import type { LanguageModel } from "ai";

export const model: LanguageModel = google("gemini-2.0-flash-exp");

// Schemas for structured AI outputs
export const summarySchema = z.object({
  title: z.string().describe("A concise title for the summary"),
  content: z.string().describe("The main summary content"),
  keyPoints: z.array(z.string()).describe("3-5 key points from the content"),
  wordCount: z.number().describe("Word count of the summary"),
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
  /**
   * Generate a summary with streaming support
   */
  async generateSummary(
    content: string,
    type: "brief" | "detailed" | "bullet_points" = "brief",
    stream = false
  ) {
    const prompt = this.buildSummaryPrompt(content, type);

    if (stream) {
      return streamText({
        model,
        prompt,
        temperature: 0.3,
      });
    }

    return generateObject({
      model,
      schema: summarySchema,
      prompt,
      temperature: 0.3,
    });
  }

  /**
   * Generate quiz questions with streaming support
   */
  async generateQuiz(
    content: string,
    difficulty: "easy" | "medium" | "hard" = "medium",
    questionCount = 5,
    stream = false
  ) {
    const prompt = this.buildQuizPrompt(content, difficulty, questionCount);

    if (stream) {
      return streamText({
        model,
        prompt,
        temperature: 0.4,
      });
    }

    return generateObject({
      model,
      schema: quizSchema,
      prompt,
      temperature: 0.4,
    });
  }

  /**
   * Generate flashcards with streaming support
   */
  async generateFlashcards(
    content: string,
    count = 10,
    difficulty: "easy" | "medium" | "hard" = "medium",
    stream = false
  ) {
    const prompt = this.buildFlashcardPrompt(content, count, difficulty);

    if (stream) {
      return streamText({
        model,
        prompt,
        temperature: 0.4,
      });
    }

    return generateObject({
      model,
      schema: flashcardSchema,
      prompt,
      temperature: 0.4,
    });
  }

  /**
   * Generate related resources
   */
  async generateResources(content: string, title: string) {
    const prompt = this.buildResourcePrompt(content, title);

    return generateObject({
      model,
      schema: resourceSchema,
      prompt,
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

export const aiService = new AIService();
