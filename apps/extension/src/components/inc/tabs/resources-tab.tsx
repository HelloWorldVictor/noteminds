import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Sparkles,
} from "lucide-react";

const resources = [
  {
    title: "Introduction to Neural Networks",
    type: "Article",
    source: "MIT OpenCourseWare",
    url: "#",
    icon: FileText,
    relevance: 95,
  },
  {
    title: "Deep Learning Specialization",
    type: "Course",
    source: "Coursera",
    url: "#",
    icon: Video,
    relevance: 92,
  },
  {
    title: "Machine Learning Fundamentals",
    type: "Book",
    source: "Stanford University",
    url: "#",
    icon: BookOpen,
    relevance: 88,
  },
  {
    title: "Understanding Backpropagation",
    type: "Article",
    source: "Towards Data Science",
    url: "#",
    icon: FileText,
    relevance: 85,
  },
];

export function ResourcesTab() {
  return (
    <div className="space-y-4">
      {/* AI Recommendation */}
      <Card className="border-primary/20 bg-primary/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            AI Recommended
          </h3>
        </div>
        <p className="text-pretty text-xs text-foreground/80">
          Based on this content, we found {resources.length} highly relevant
          resources to deepen your understanding.
        </p>
      </Card>

      {/* Resources List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Additional Resources
        </h3>
        <div className="space-y-2">
          {resources.map((resource, index) => (
            <Card
              key={index}
              className="group p-4 transition-colors hover:bg-accent"
            >
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <resource.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-pretty text-sm font-medium leading-tight text-foreground">
                      {resource.title}
                    </h4>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {resource.relevance}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{resource.type}</span>
                    <span>•</span>
                    <span>{resource.source}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-7 gap-1 px-2 text-xs text-primary"
                  >
                    Open Resource
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Load More */}
      <Button variant="outline" className="w-full bg-transparent">
        Load More Resources
      </Button>
    </div>
  );
}
