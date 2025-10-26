import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Volume2 } from "lucide-react";

export function SummaryTab() {
  return (
    <div className="space-y-4">
      {/* Key Insights */}
      <Card className="border-primary/20 bg-primary/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">Key Insights</h3>
        </div>
        <ul className="space-y-2 text-sm text-foreground/90">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              Machine learning algorithms can be categorized into supervised,
              unsupervised, and reinforcement learning
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              Neural networks are inspired by biological neurons and form the
              basis of deep learning
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            <span>
              Training data quality directly impacts model performance and
              accuracy
            </span>
          </li>
        </ul>
      </Card>

      {/* Summary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Summary</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Volume2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <Card className="p-4">
          <p className="text-pretty text-sm leading-relaxed text-foreground/80">
            This article explores the fundamentals of machine learning, covering
            key concepts such as supervised and unsupervised learning, neural
            networks, and the importance of quality training data. It provides a
            comprehensive introduction to how machines learn from data and make
            predictions.
          </p>
        </Card>
      </div>

      {/* Topics Covered */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Topics Covered
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
          >
            Machine Learning
          </Badge>
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
          >
            Neural Networks
          </Badge>
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
          >
            Deep Learning
          </Badge>
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
          >
            Data Science
          </Badge>
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground"
          >
            AI Algorithms
          </Badge>
        </div>
      </div>

      {/* Reading Progress */}
      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Reading Progress
          </span>
          <span className="text-sm text-muted-foreground">65%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[65%] rounded-full bg-primary" />
        </div>
      </Card>
    </div>
  );
}
