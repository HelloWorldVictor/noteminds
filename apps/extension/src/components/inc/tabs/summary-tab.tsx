import { Card } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { ChevronRight, NotepadText, Sparkles } from "lucide-react";
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
import { client, baseUrl } from "@/lib/client";
import { summarySchema } from "@noteminds/backend/lib/schemas";
import { authTokenStorage } from "@/lib/auth-storage";
import { extractContent } from "@/lib/content-extractor";
import { Message } from "@/components/ai-elements/message";
import { Streamdown } from "streamdown";

export function SummaryTab() {
  const { object, isLoading, submit } = useObject({
    api: baseUrl + "/summary/generate",
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
  });
  console.log(object);
  return (
    <div className="space-y-6">
      {/* Summaries List */}
      <div className="space-y-3">
        <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
          <NotepadText className="size-4" />
          <span>Page Summaries</span>
        </div>
        {<>{object?.content}</>}
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <NotepadText />
            </EmptyMedia>
            <EmptyTitle>No Page Summaries Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any page summaries yet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const html = extractContent();
                  console.log("Extracted html: ", html);
                  // return;
                  submit({
                    webpageId: "0a5dc823-91d9-4026-aab3-3ee2ca749846",
                  });
                }}
              >
                Create Page Summary
              </Button>
            </div>
          </EmptyContent>
        </Empty>

        {/* <div className="space-y-2">
          <Card className="border-border bg-background/60 border p-0 shadow-none">
            <Item className="rounded-xl border-0 px-4 py-3">
              <ItemContent>
                <ItemTitle>ALU – Design Thinking (Week 1)</ItemTitle>
                <ItemDescription>
                  This module introduces the human-centered design process,
                  emphasising user empathy and iterative prototyping.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className="text-muted-foreground mr-1 text-xs">
                  Oct 21
                </span>
                <ChevronRight className="text-muted-foreground h-3 w-3" />
              </ItemActions>
            </Item>
          </Card>

          <Card className="border-border bg-background/60 border p-0 shadow-none">
            <Item className="rounded-xl border-0 px-4 py-3">
              <ItemContent>
                <ItemTitle>ALU – Design Thinking (Week 1)</ItemTitle>
                <ItemDescription>
                  This module introduces the human-centered design process,
                  emphasising user empathy and iterative prototyping.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className="text-muted-foreground mr-1 text-xs">
                  Oct 21
                </span>
                <ChevronRight className="text-muted-foreground h-3 w-3" />
              </ItemActions>
            </Item>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
