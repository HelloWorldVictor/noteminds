import { Elysia, t } from "elysia";
import { webpageService } from "@/services/webpage-service";

export const webpageRoutes = new Elysia({ prefix: "/webpage" })
  .post(
    "/analyze",
    async ({ body, set }) => {
      try {
        const { url, html, userId } = body;

        const result = await webpageService.analyzeWebpage(url, userId, html);

        return {
          success: true,
          message: result.isNew
            ? "Webpage analyzed and stored"
            : "Webpage already exists",
          data: {
            webpage: result.webpage,
            isNew: result.isNew,
            content: {
              title: result.processedContent.title,
              wordCount: result.processedContent.metadata.wordCount,
              readingTime: result.processedContent.metadata.readingTime,
              author: result.processedContent.metadata.author,
              description: result.processedContent.metadata.description,
            },
          },
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to analyze webpage",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      body: t.Object({
        url: t.String({ format: "uri" }),
        userId: t.String(),
        html: t.Optional(t.String()),
      }),
      detail: {
        summary: "Analyze a webpage and extract content",
        description:
          "Submit a URL and optional HTML content to analyze and process for AI features",
        tags: ["Webpage"],
      },
    }
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      try {
        const { id } = params;

        const webpage = await webpageService.getWebpage(id);

        if (!webpage) {
          set.status = 404;
          return {
            success: false,
            message: "Webpage not found",
          };
        }

        return {
          success: true,
          data: webpage,
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: "Failed to get webpage",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        summary: "Get webpage by ID",
        description: "Retrieve a previously analyzed webpage by its ID",
        tags: ["Webpage"],
      },
    }
  );
