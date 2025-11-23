import { google } from "@ai-sdk/google";
import { streamObject, generateObject } from "ai";
import { z } from "zod";
import type { LanguageModel } from "ai";
import { db, summary } from "@/db";
import { flashcard, quiz } from "@/db/app-schema";
import { summarySchema, quizSchema, flashcardSchema } from "./schemas";

export const aiModel: LanguageModel = google("gemini-2.0-flash-lite");

// Re-export schemas for convenience
export { summarySchema, quizSchema, flashcardSchema };

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
   * Generate quiz questions and return database record
   */
  async generateQuiz({
    webpageId,
    content,
    questionCount = 5,
    systemPrompt = "You are an expert educator creating quiz questions. Generate multiple-choice questions that test understanding and critical thinking. Each question should have exactly 4 answer options with one correct answer.",
  }: {
    webpageId: string;
    content: string;
    questionCount?: number;
    systemPrompt?: string;
  }) {
    console.log(
      `[AI Service] Generating ${questionCount} quiz questions for user: ${this.userId}`
    );
    const prompt = `Generate ${questionCount} multiple-choice quiz questions from this content. Each question should have exactly 4 answer options:\n\n${content}`;

    const createdBy = this.userId;

    // Generate quiz with AI
    const { object } = await generateObject({
      model: aiModel,
      schema: quizSchema,
      prompt,
      system: systemPrompt,
      temperature: 0.4,
    });

    console.log(
      `[AI Service] Persisting quiz with ${object.questions.length} questions to database`
    );

    // Save to database and return the created record
    const [createdQuiz] = await db
      .insert(quiz)
      .values({
        userId: createdBy,
        webpageId,
        title: object.title,
        questions: object.questions,
      })
      .returning();

    console.log(`[AI Service] Successfully saved quiz`);
    return createdQuiz;
  }

  /**
   * Generate flashcards and return database records
   */
  async generateFlashcards({
    webpageId,
    content,
    count = 10,
    systemPrompt = "You are an expert educator creating flashcards for students. Generate high-quality flashcards based on the provided content. Each flashcard should test a key concept or fact. Keep questions clear and answers concise.",
  }: {
    webpageId: string;
    content: string;
    count?: number;
    systemPrompt?: string;
  }) {
    console.log(
      `[AI Service] Generating ${count} flashcards for user: ${this.userId}`
    );
    const prompt = `Generate ${count} flashcards from this content:\n\n${content}`;

    const createdBy = this.userId;

    // Generate flashcards with AI
    const { object } = await generateObject({
      model: aiModel,
      schema: flashcardSchema,
      prompt,
      system: systemPrompt,
      temperature: 0.4,
    });

    console.log(
      `[AI Service] Persisting ${object.flashcards.length} flashcards to database`
    );

    // Save to database and return the created records
    const createdFlashcards = await db
      .insert(flashcard)
      .values(
        object.flashcards.map((card) => ({
          userId: createdBy,
          webpageId,
          front: card.front,
          back: card.back,
          practiceCount: 0,
        }))
      )
      .returning();

    console.log(
      `[AI Service] Successfully saved ${createdFlashcards.length} flashcards`
    );
    return createdFlashcards;
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
