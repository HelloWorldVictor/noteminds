import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { createFileRoute, redirect } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [autoSummarize, setAutoSummarize] = React.useState(true);
  const [reminders, setReminders] = React.useState(true);

  return (
    <div className="space-y-4 px-5">
      <div className="flex items-start justify-between pt-4">
        <div>
          <h2 className="text-base font-semibold">Welcome, Yusuf 👋</h2>
          <p className="text-muted-foreground text-xs">
            You’re reading better with NoteMinds
          </p>
        </div>
        <small className="text-muted-foreground text-xs">Tue 28th Oct</small>
      </div>

      <div className="flex gap-3">
        <Card className="w-1/2 p-4 text-center">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold">Reading</h4>
            <div className="bg-muted rounded-[14px] px-2 py-1 text-[10px]">
              Goal 1h
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <ProgressCircle value={70} />
            <div className="text-left">
              <h3 className="text-base font-semibold">42m</h3>
              <p className="text-muted-foreground text-xs">70% of daily goal</p>
            </div>
          </div>
        </Card>

        <Card className="w-1/2 p-4 text-center">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold">Understanding</h4>
            <div className="rounded-[14px] bg-green-600 px-2 py-1 text-[10px] text-white">
              +5%
            </div>
          </div>
          <div className="mb-1 flex items-center justify-center gap-2">
            <h3 className="text-base font-semibold">85%</h3>
            <div className="h-[46px] w-[72px]">
              <svg viewBox="0 0 72 46" width="72" height="46" aria-hidden>
                <polyline
                  points="2,34 18,22 34,28 50,18 70,12"
                  fill="none"
                  stroke="#15a64a"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">Avg quiz score |</p>
          <p className="text-muted-foreground text-xs">Last 6 sessions</p>
        </Card>
      </div>

      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Active Learning</h4>
          <div className="bg-muted rounded-[14px] px-2 py-1 text-xs">
            Your first session
          </div>
        </div>
        <p className="text-sm">📝 2 Notes ✨ 1 Summary</p>
        <div className="bg-muted mt-3 rounded-[14px] p-2 text-xs">
          💡 Tip: Highlight a paragraph to generate a summary or quick quiz on
          the spot
        </div>
      </Card>

      <Card className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm">⚡ Auto-Summarize</label>
            <Switch
              checked={autoSummarize}
              onCheckedChange={setAutoSummarize}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">🔔 Study Reminders</label>
            <Switch checked={reminders} onCheckedChange={setReminders} />
          </div>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" className="w-1/2">
          Review Notes
        </Button>
        <Button className="w-1/2">Keep Reading</Button>
      </div>
    </div>
  );
}

function ProgressCircle({ value = 50 }: { value?: number }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const dashArray = `${circumference} ${circumference}`;
  const dashOffset = circumference - (value / 100) * circumference;
  return (
    <div className="relative mx-auto mb-2 h-[70px] w-[70px]">
      <svg className="h-[70px] w-[70px] -rotate-90">
        <circle
          cx="35"
          cy="35"
          r="30"
          className="fill-none stroke-gray-200"
          strokeWidth={8}
        />
        <circle
          cx="35"
          cy="35"
          r="30"
          className="fill-none stroke-green-600"
          strokeWidth={8}
          strokeLinecap="round"
          style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold">
        {value}%
      </div>
    </div>
  );
}
