import { useEffect, useState } from "react";
import { ActivityItem } from "@/components/inc/activity-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentStore } from "@/lib/store";
import { Add, Edit, Flash, FolderOpen, MessageQuestion } from "iconsax-reactjs";
import { History, Loader2 } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Summary, UserNote, Quiz, Flashcard } from "@/lib/types";

interface RecentActivity {
  type: "summary" | "note" | "quiz" | "flashcard";
  id: string;
  title: string;
  description: string;
  timestamp: number;
}

export function HomeTab() {
  const { webpageId } = useContentStore();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (webpageId) {
      fetchRecentActivity();
    }
  }, [webpageId]);

  const fetchRecentActivity = async () => {
    setIsLoading(true);
    try {
      const token = await (
        await import("@/lib/auth-storage")
      ).authTokenStorage.getValue();

      // Fetch all recent items in parallel
      const [summariesRes, notesRes, quizzesRes, flashcardsRes] =
        await Promise.all([
          fetch(`http://localhost:4137/summary/webpage/${webpageId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4137/note/webpage/${webpageId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4137/quiz/webpage/${webpageId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4137/flashcard/webpage/${webpageId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const summaries: { success: boolean; data: Summary[] } =
        await summariesRes.json();
      const notes: { success: boolean; data: UserNote[] } =
        await notesRes.json();
      const quizzes: { success: boolean; data: Quiz[] } =
        await quizzesRes.json();
      const flashcards: { success: boolean; data: Flashcard[] } =
        await flashcardsRes.json();

      // Combine and sort by most recent
      const activities: RecentActivity[] = [];

      if (summaries.success) {
        summaries.data.forEach((s) => {
          activities.push({
            type: "summary",
            id: s.id,
            title: s.title,
            description: `${s.type} summary`,
            timestamp: s.createdAt,
          });
        });
      }

      if (notes.success) {
        notes.data.forEach((n) => {
          activities.push({
            type: "note",
            id: n.id,
            title:
              n.content.slice(0, 50) + (n.content.length > 50 ? "..." : ""),
            description: "Personal note",
            timestamp: n.updatedAt,
          });
        });
      }

      if (quizzes.success) {
        quizzes.data.forEach((q) => {
          activities.push({
            type: "quiz",
            id: q.id,
            title: q.title,
            description: `${q.questions.length} questions`,
            timestamp: q.createdAt,
          });
        });
      }

      if (flashcards.success) {
        flashcards.data.forEach((f) => {
          activities.push({
            type: "flashcard",
            id: f.id,
            title: f.front,
            description: `Reviewed ${f.practiceCount} times`,
            timestamp: f.createdAt,
          });
        });
      }

      // Sort by timestamp descending and take top 5
      activities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch recent activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return new Intl.DateTimeFormat("en-GB", {
      month: "short",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  const quickActions = [
    {
      icon: Flash,
      label: "Summarize page",
      action: () => {
        // Navigate to summary tab and trigger generation
        const event = new CustomEvent("noteminds:navigate-tab", {
          detail: { tab: "summaries" },
        });
        window.dispatchEvent(event);
      },
    },
    {
      icon: MessageQuestion,
      label: "Generate quiz",
      action: () => {
        // Navigate to quiz tab
        const event = new CustomEvent("noteminds:navigate-tab", {
          detail: { tab: "quiz" },
        });
        window.dispatchEvent(event);
      },
    },
    {
      icon: Edit,
      label: "New note",
      action: () => {
        // Navigate to notes tab
        const event = new CustomEvent("noteminds:navigate-tab", {
          detail: { tab: "notes" },
        });
        window.dispatchEvent(event);
      },
    },
    {
      icon: FolderOpen,
      label: "Save to library",
      action: () => {
        // Navigate to library tab (when implemented)
        console.log("Save to library");
      },
    },
  ];

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

        {isLoading ? (
          <div className="grid gap-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="grid gap-2">
            {recentActivity.map((activity) => (
              <ActivityItem
                key={`${activity.type}-${activity.id}`}
                variant={activity.type}
                title={activity.title}
                description={activity.description}
                timestamp={formatTimestamp(activity.timestamp)}
                onClick={() => {
                  // Navigate to appropriate tab
                  const tabMap = {
                    summary: "summaries",
                    note: "notes",
                    quiz: "quiz",
                    flashcard: "quiz",
                  };
                  const event = new CustomEvent("noteminds:navigate-tab", {
                    detail: { tab: tabMap[activity.type] },
                  });
                  window.dispatchEvent(event);
                }}
              />
            ))}
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <History />
              </EmptyMedia>
              <EmptyTitle>No Recent Activity</EmptyTitle>
              <EmptyDescription>
                Start by using quick actions above
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  );
}
