import { Card } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { ChevronRight, Sparkles } from "lucide-react";

export function SummaryTab() {
  return (
    <div className="space-y-6">
      {/* Summaries List */}
      <div className="space-y-3">
        <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4" />
          <span>Summaries</span>
        </div>
        <div className="space-y-2">
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
        </div>
      </div>
    </div>
  );
}
