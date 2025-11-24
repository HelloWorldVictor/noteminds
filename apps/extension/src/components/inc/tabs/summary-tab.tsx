import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { ChevronRight, NotepadText, Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { summarySchema } from "@noteminds/backend/lib/schemas";
import { authTokenStorage } from "@/lib/auth-storage";
import { useContentStore } from "@/lib/store";
import { $api } from "@/lib/api";
import type { Summary, ApiResponse } from "@/lib/types";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SummaryTab() {
  const { webpageId } = useContentStore();
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);

  // Fetch existing summaries for the webpage
  const {
    data,
    isLoading: isFetching,
    refetch,
  } = $api.useQuery(
    "get",
    "/summary/webpage/{webpageId}",
    {
      params: {
        path: {
          webpageId: webpageId || "",
        },
      },
    },
    {
      enabled: !!webpageId,
    }
  );

  const summaries = (
    (data as unknown as ApiResponse<Summary[]>)?.data || []
  ).sort((a, b) => b.createdAt - a.createdAt);

  // Generate new summary
  const {
    object,
    isLoading: isGenerating,
    submit,
  } = useObject({
    api: "http://localhost:4137/summary/generate",
    schema: summarySchema,
    fetch: async (url, options) => {
      const token = await authTokenStorage.getValue();
      return fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
    },
    onFinish: async () => {
      // Refetch summaries after generation
      const result = await refetch();
      const newSummaries = (
        (result.data as unknown as ApiResponse<Summary[]>)?.data || []
      ).sort((a, b) => b.createdAt - a.createdAt);
      if (newSummaries.length > 0) {
        setSelectedSummary(newSummaries[0]);
      }
    },
  });

  const handleGenerateSummary = async (
    type: "brief" | "detailed" | "bullet_points" = "brief"
  ) => {
    if (!webpageId) {
      console.error("No webpageId available");
      return;
    }

    setSelectedSummary(null);
    submit({
      webpageId,
      type,
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-GB", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleSelectSummary = (summary: Summary) => {
    setSelectedSummary(summary);
  };

  return (
    <div className="space-y-4">
      {!webpageId ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <NotepadText />
            </EmptyMedia>
            <EmptyTitle>No Webpage Loaded</EmptyTitle>
            <EmptyDescription>
              Navigate to a webpage to create summaries
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {/* Focused Summary View */}
          {(selectedSummary || isGenerating) && (
            <Card className={isGenerating ? "border-primary/50" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-sm font-medium">
                        Generating Summary...
                      </span>
                    </>
                  ) : (
                    <>
                      <NotepadText className="size-4" />
                      <span className="text-sm font-medium">
                        {selectedSummary?.title}
                      </span>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSelectedSummary(null)}
                >
                  <X className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {isGenerating ? (
                    <div className="space-y-2">
                      {object?.title && (
                        <h3 className="text-base font-semibold">
                          {object.title}
                        </h3>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {object?.content || "Starting generation..."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedSummary?.content}
                      </p>
                      <div className="text-muted-foreground flex items-center gap-3 border-t pt-2 text-xs">
                        <span className="capitalize">
                          {selectedSummary?.type.replace("_", " ")}
                        </span>
                        <span>•</span>
                        <span>{selectedSummary?.wordCount} words</span>
                        <span>•</span>
                        <span>
                          {selectedSummary?.createdAt &&
                            new Intl.DateTimeFormat("en-GB", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }).format(new Date(selectedSummary.createdAt))}
                        </span>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Summaries List */}
          <div className="space-y-3">
            <div className="text-foreground flex items-center justify-between text-sm font-semibold">
              <div className="flex items-center gap-2">
                <NotepadText className="size-4" />
                <span>All Summaries</span>
              </div>
              <div className="flex items-center gap-2">
                {summaries.length > 0 && (
                  <span className="text-muted-foreground text-xs font-normal">
                    {summaries.length}{" "}
                    {summaries.length === 1 ? "summary" : "summaries"}
                  </span>
                )}
                {summaries.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerateSummary("brief")}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="size-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {isFetching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground size-6 animate-spin" />
              </div>
            ) : summaries.length > 0 ? (
              <div className="space-y-2">
                {summaries.map((summary) => (
                  <Card
                    key={summary.id}
                    className={`border-border bg-background/60 hover:bg-background cursor-pointer border p-0 shadow-none transition-colors ${
                      selectedSummary?.id === summary.id
                        ? "ring-primary/50 ring-2"
                        : ""
                    }`}
                    onClick={() => handleSelectSummary(summary)}
                  >
                    <Item className="rounded-xl border-0 px-4 py-3">
                      <ItemContent>
                        <ItemTitle>{summary.title}</ItemTitle>
                        <ItemDescription className="line-clamp-2">
                          {summary.content}
                        </ItemDescription>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-muted-foreground text-xs capitalize">
                            {summary.type.replace("_", " ")}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            •
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {summary.wordCount} words
                          </span>
                        </div>
                      </ItemContent>
                      <ItemActions>
                        <span className="text-muted-foreground mr-1 text-xs">
                          {formatDate(summary.createdAt)}
                        </span>
                        <ChevronRight className="text-muted-foreground h-3 w-3" />
                      </ItemActions>
                    </Item>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <NotepadText />
                  </EmptyMedia>
                  <EmptyTitle>No Page Summaries Yet</EmptyTitle>
                  <EmptyDescription>
                    Create your first summary of this webpage
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleGenerateSummary("brief")}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 size-4" />
                          Generate Summary
                        </>
                      )}
                    </Button>
                  </div>
                </EmptyContent>
              </Empty>
            )}
          </div>
        </>
      )}
    </div>
  );
}
