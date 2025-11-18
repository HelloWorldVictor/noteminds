import { ActivityItem } from "@/components/inc/activity-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Add, Edit, Flash, FolderOpen, MessageQuestion } from "iconsax-reactjs";
import { History } from "lucide-react";

const quickActions = [
  {
    icon: Flash,
    label: "Summarize page",
    action: () => console.log("Summarize page"),
  },
  {
    icon: MessageQuestion,
    label: "Generate quiz",
    action: () => console.log("Generate quiz"),
  },
  {
    icon: Edit,
    label: "New note",
    action: () => console.log("New note"),
  },
  {
    icon: FolderOpen,
    label: "Save to library",
    action: () => console.log("Save to library"),
  },
];

export function HomeTab() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-1 font-semibold">
          <Add size={18} /> <span>Quick Actions</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="default"
                onClick={action.action}
                className="bg-noir/70 hover:bg-noir/80 h-12 justify-start gap-2 border-none font-medium"
              >
                <IconComponent size={24} />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
      <Card className="bg-muted rounded-xl px-3 py-2 shadow-none">
        <p>
          <span className="font-bold">💡 Tip: </span> Highlight a paragraph to
          generate a summary or quick quiz on the spot
        </p>
      </Card>
      <div className="space-y-3">
        <div className="flex items-center gap-1 font-semibold">
          <History size={18} /> <span>Recent Activity</span>
        </div>
        <div className="grid gap-2">
          <ActivityItem
            variant="summary"
            title="Design Thinking – Week 1"
            description="Key ideas & actions"
            timestamp="2m"
            onClick={() => console.log("Open summary")}
          />

          <ActivityItem
            variant="note"
            title="Empathy Map Prompts"
            description="Highlight"
            timestamp="12m"
            onClick={() => console.log("Open note")}
          />

          <ActivityItem
            variant="quiz"
            title="Design Thinking"
            description="Generated from this page"
            timestamp="1h"
            onClick={() => console.log("Open quiz")}
          />

          <ActivityItem
            variant="library"
            title="Design Thinking Resources"
            description="3 references saved"
            timestamp="Yesterday"
            onClick={() => console.log("Open library")}
          />
        </div>
      </div>
    </div>
  );
}
