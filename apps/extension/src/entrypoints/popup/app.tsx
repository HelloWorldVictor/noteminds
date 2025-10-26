import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Settings,
  Sparkles,
  Bell,
  Moon,
  Zap,
  ExternalLink,
  TrendingUp,
  Clock,
  Target,
} from "lucide-react";
import "@/styles/globals.css";

export function App() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="w-[380px] bg-background">
      {/* Header */}
      <div className="border-b border-border bg-linear-to-r from-primary/10 to-primary/5 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Noteminds</h1>
            <p className="text-xs text-muted-foreground">
              Smart Reading Assistant
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 p-4">
        <Card className="p-3 text-center">
          <TrendingUp className="mx-auto mb-1 h-4 w-4 text-primary" />
          <div className="text-lg font-bold text-foreground">24</div>
          <div className="text-xs text-muted-foreground">Pages Read</div>
        </Card>
        <Card className="p-3 text-center">
          <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
          <div className="text-lg font-bold text-foreground">3.2h</div>
          <div className="text-xs text-muted-foreground">Study Time</div>
        </Card>
        <Card className="p-3 text-center">
          <Target className="mx-auto mb-1 h-4 w-4 text-primary" />
          <div className="text-lg font-bold text-foreground">85%</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </Card>
      </div>

      {/* Current Page Status */}
      <div className="px-4 pb-4">
        <Card className="border-primary/20 bg-primary/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Current Page
              </span>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Active
            </Badge>
          </div>
          <p className="mb-3 text-pretty text-xs text-foreground/80">
            Introduction to Machine Learning - Understanding Neural Networks
          </p>
          <Button
            size="sm"
            className="w-full gap-2 bg-primary text-primary-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open Sidebar
          </Button>
        </Card>
      </div>

      <Separator />

      {/* Quick Settings */}
      <div className="space-y-3 p-4">
        <h3 className="text-sm font-semibold text-foreground">
          Quick Settings
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Auto-Summarize
              </p>
              <p className="text-xs text-muted-foreground">
                Analyze pages automatically
              </p>
            </div>
          </div>
          <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Study Reminders
              </p>
              <p className="text-xs text-muted-foreground">
                Get notified to review
              </p>
            </div>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Reduce eye strain</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <Separator />

      {/* Footer Actions */}
      <div className="space-y-2 p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent"
        >
          <Settings className="h-4 w-4" />
          Full Settings
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Version 1.0.0 • Made with ❤️ for ALU
        </p>
      </div>
    </div>
  );
}
