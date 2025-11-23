// This file provides utilities to process HTML content into clean text and markdown.
// It extracts the main article, removes unwanted elements, and calculates metadata like word count.
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";
import * as cheerio from "cheerio";
import crypto from "crypto";

export interface ProcessedContent {
  title: string;
  content: string;
  markdown: string;
  textContent: string;
  metadata: {
    author?: string;
    publishedDate?: string;
    description?: string;
    wordCount: number;
    readingTime: number;
    contentHash: string;
  };
}

export class ContentProcessor {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: "atx",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
    });
  }

  /**
   * Process HTML content and extract clean, readable content
   */
  async processHtml(html: string, url?: string): Promise<ProcessedContent> {
    try {
      // Create DOM from HTML
      const dom = new JSDOM(html, { url });
      const document = dom.window.document;

      // Use Readability to extract main content
      const reader = new Readability(document);
      const article = reader.parse();

      if (!article) {
        throw new Error("Failed to extract readable content from HTML");
      }

      // Load content into Cheerio for additional processing
      const $ = cheerio.load(article.content || "");

      // Remove unwanted elements
      $(
        "script, style, nav, header, footer, aside, .advertisement, .ads"
      ).remove();

      // Clean up attributes we don't need
      $("*").each((_, element) => {
        const $el = $(element);
        const allowedAttrs = ["href", "src", "alt", "title"];

        // Get all attribute names and remove unwanted ones
        const attrNames = Object.getOwnPropertyNames($el.attr() || {});
        attrNames.forEach((attr) => {
          if (!allowedAttrs.includes(attr)) {
            $el.removeAttr(attr);
          }
        });
      });

      const cleanedContent = $.html();
      const textContent = $.text().trim();

      // Convert to markdown
      const markdown = this.turndownService.turndown(cleanedContent);

      // Calculate metadata
      const wordCount = this.calculateWordCount(textContent);
      const readingTime = this.calculateReadingTime(wordCount);
      const contentHash = this.generateContentHash(textContent);

      // Extract additional metadata from the original document
      const metadata = this.extractMetadata(document, {
        wordCount,
        readingTime,
        contentHash,
      });

      return {
        title: article.title || this.extractTitle(document) || "Untitled",
        content: cleanedContent,
        markdown,
        textContent,
        metadata,
      };
    } catch (error) {
      throw new Error(
        `Content processing failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Fetch and process content from URL
   */
  async processUrl(url: string): Promise<ProcessedContent> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; Noteminds/1.0; +https://noteminds.com/bot)",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return this.processHtml(html, url);
    } catch (error) {
      throw new Error(
        `Failed to fetch URL: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Calculate word count from text
   */
  private calculateWordCount(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }

  /**
   * Calculate estimated reading time in minutes
   */
  private calculateReadingTime(wordCount: number): number {
    const wordsPerMinute = 200; // Average reading speed
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  /**
   * Generate SHA-256 hash of content for deduplication
   */
  private generateContentHash(content: string): string {
    return crypto.createHash("sha256").update(content.trim()).digest("hex");
  }

  /**
   * Extract metadata from document
   */
  private extractMetadata(
    document: Document,
    baseMetadata: {
      wordCount: number;
      readingTime: number;
      contentHash: string;
    }
  ) {
    const getMetaContent = (name: string): string | undefined => {
      const meta = document.querySelector(
        `meta[name="${name}"], meta[property="${name}"]`
      );
      return meta?.getAttribute("content") || undefined;
    };

    return {
      author: getMetaContent("author") || getMetaContent("article:author"),
      publishedDate:
        getMetaContent("article:published_time") || getMetaContent("date"),
      description:
        getMetaContent("description") || getMetaContent("og:description"),
      ...baseMetadata,
    };
  }

  /**
   * Extract title from document as fallback
   */
  private extractTitle(document: Document): string | undefined {
    // Try various title extraction methods
    const titleElement = document.querySelector("title");
    const h1Element = document.querySelector("h1");
    const ogTitle = document.querySelector('meta[property="og:title"]');

    return (
      ogTitle?.getAttribute("content") ||
      titleElement?.textContent ||
      h1Element?.textContent ||
      undefined
    );
  }
}

export const contentProcessor = new ContentProcessor();
