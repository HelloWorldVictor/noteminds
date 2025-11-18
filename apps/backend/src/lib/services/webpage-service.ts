import { eq, and } from "drizzle-orm";
import { db, webpage, type WebpageInsert, type WebpageSelect } from "@/db";
import { contentProcessor, type ProcessedContent } from "./content-processor";

export class WebpageService {
  /**
   * Analyze a webpage from URL or HTML content
   */
  async analyzeWebpage(
    url: string,
    userId: string,
    html?: string
  ): Promise<{
    webpage: WebpageSelect;
    isNew: boolean;
    processedContent: ProcessedContent;
  }> {
    try {
      // Process the content
      const processedContent = html
        ? await contentProcessor.processHtml(html, url)
        : await contentProcessor.processUrl(url);

      // Check if we already have this content (by hash)
      const existingWebpage = await db.query.webpage.findFirst({
        where: and(
          eq(webpage.url, url),
          eq(webpage.contentHash, processedContent.metadata.contentHash)
        ),
      });

      if (existingWebpage) {
        return {
          webpage: existingWebpage,
          isNew: false,
          processedContent,
        };
      }

      // Create new webpage record
      const newWebpageData: WebpageInsert = {
        url,
        title: processedContent.title,
        extractedContent: processedContent.markdown,
        contentHash: processedContent.metadata.contentHash,
        metadata: {
          author: processedContent.metadata.author,
          publishedDate: processedContent.metadata.publishedDate,
          description: processedContent.metadata.description,
          wordCount: processedContent.metadata.wordCount,
          readingTime: processedContent.metadata.readingTime,
        },
        createdBy: userId,
      };

      const [newWebpage] = await db
        .insert(webpage)
        .values(newWebpageData)
        .returning();

      if (!newWebpage) {
        throw new Error("Failed to create webpage record");
      }

      return {
        webpage: newWebpage,
        isNew: true,
        processedContent,
      };
    } catch (error) {
      throw new Error(
        `Failed to analyze webpage: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get webpage by ID
   */
  async getWebpage({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<WebpageSelect | null> {
    try {
      const result = await db.query.webpage.findFirst({
        where: and(eq(webpage.id, id), eq(webpage.createdBy, userId)),
      });
      return result || null;
    } catch (error) {
      throw new Error(
        `Failed to get webpage: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get webpage by URL
   */
  async getWebpageByUrl(url: string): Promise<WebpageSelect | null> {
    try {
      const result = await db.query.webpage.findFirst({
        where: eq(webpage.url, url),
      });
      return result || null;
    } catch (error) {
      throw new Error(
        `Failed to get webpage by URL: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Search webpages by content hash (for deduplication)
   */
  async findByContentHash(contentHash: string): Promise<WebpageSelect[]> {
    try {
      return await db.query.webpage.findMany({
        where: eq(webpage.contentHash, contentHash),
      });
    } catch (error) {
      throw new Error(
        `Failed to search by content hash: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Update webpage content (in case of content changes)
   */
  async updateWebpage(
    id: string,
    updates: Partial<WebpageInsert>
  ): Promise<WebpageSelect> {
    try {
      const [updatedWebpage] = await db
        .update(webpage)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(webpage.id, id))
        .returning();

      if (!updatedWebpage) {
        throw new Error("Webpage not found");
      }

      return updatedWebpage;
    } catch (error) {
      throw new Error(
        `Failed to update webpage: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}

export const webpageService = new WebpageService();
