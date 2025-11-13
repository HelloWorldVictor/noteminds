import { useEffect } from "react";
import {
  AuthUIProvider,
  AuthView,
  useAuthenticate,
} from "@daveyplate/better-auth-ui";
import { createAuthClient } from "better-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import "@/styles/globals.css";
import React from "react";

const authClient = createAuthClient({ baseURL: "http://localhost:4137" });

type PageKey = "welcome" | "progressStart" | "progressUpdate";

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

function MainApp() {
  useAuthenticate();
  const [page, setPage] = React.useState<PageKey>("welcome");
  const [autoSummarize, setAutoSummarize] = React.useState(true);
  const [reminders, setReminders] = React.useState(true);

  // Directly render the app UI. User is authenticated if we reach here.
  return (
    <div className="bg-background text-foreground w-[430px] max-w-[430px] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/alu.png"
            alt="Noteminds Logo"
            className="h-[32px] w-auto"
          />
          <h3 className="text-base font-semibold">NoteMinds</h3>
        </div>
        {/* Optionally add a logout flow here if supported by your provider */}
      </div>
      {page === "welcome" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">NoteMinds</h3>
            <img
              src="/alu.png"
              alt="NoteMinds Logo"
              className="h-[40px] w-auto"
            />
          </div>
          <Separator />
          <div className="text-center">
            <div className="bg-foreground text-background mx-auto mb-2 flex h-[60px] w-[60px] items-center justify-center rounded-full text-2xl">
              <span>📖</span>
            </div>
            <h3 className="text-base font-semibold">Welcome to NoteMinds 🌟</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Your AI reading assistant ready to help you <b>learn smarter.</b>{" "}
              Summarize, generate quizzes and flashcards, save resources, and
              take notes while you read — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { i: "🧠", h: "Smart Summaries", p: "Get concise page recaps" },
              { i: "❓", h: "Quick Quizzes", p: "Test your understanding" },
              { i: "📝", h: "Context Notes", p: "Take notes while reading" },
              { i: "🔗", h: "Save Resources", p: "Keep resources organized" },
            ].map((c) => (
              <Card key={c.h} className="p-4 text-center">
                <div className="text-2xl">{c.i}</div>
                <h3 className="mt-2 text-sm font-semibold">{c.h}</h3>
                <p className="text-muted-foreground text-xs">{c.p}</p>
              </Card>
            ))}
          </div>

          <Button className="w-full" onClick={() => setPage("progressStart")}>
            Start Reading
          </Button>
        </div>
      )}

      {page === "progressStart" && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold">Nice Start, Yusuf 🎉</h2>
              <p className="text-muted-foreground text-xs">
                Here’s your progress so far
              </p>
            </div>
            <small className="text-muted-foreground text-xs">
              Tue 28th Oct
            </small>
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
                <ProgressCircle value={50} />
                <div className="text-left">
                  <h3 className="text-base font-semibold">30m</h3>
                  <p className="text-muted-foreground text-xs">
                    50% of daily goal
                  </p>
                </div>
              </div>
            </Card>

            <Card className="w-1/2 p-4 text-center">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-xs font-semibold">Understanding</h4>
                <div className="rounded-[14px] bg-transparent px-2 py-1 text-[10px] text-green-600">
                  1 quiz
                </div>
              </div>
              <h3 className="mt-2 text-base font-semibold">78%</h3>
              <p className="text-muted-foreground text-xs">First quiz score</p>
            </Card>
          </div>

          <Card className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold">Active Learning</h4>
              <div className="bg-muted rounded-[14px] px-2 py-1 text-xs">
                This week
              </div>
            </div>
            <p className="text-sm">📝 2 Notes ✨ 1 Summary</p>
            <div className="bg-muted mt-3 rounded-[14px] p-2 text-xs">
              💡 Tip: Highlight a paragraph to generate a summary or quick quiz
              on the spot
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
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => setPage("welcome")}
            >
              Review Notes
            </Button>
            <Button className="w-1/2" onClick={() => setPage("progressUpdate")}>
              Keep Reading
            </Button>
          </div>
        </div>
      )}

      {page === "progressUpdate" && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold">Welcome, Yusuf 👋</h2>
              <p className="text-muted-foreground text-xs">
                You’re reading better with NoteMinds
              </p>
            </div>
            <small className="text-muted-foreground text-xs">
              Tue 28th Oct
            </small>
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
                  <p className="text-muted-foreground text-xs">
                    70% of daily goal
                  </p>
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
              💡 Tip: Highlight a paragraph to generate a summary or quick quiz
              on the spot
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
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => setPage("welcome")}
            >
              Review Notes
            </Button>
            <Button className="w-1/2" onClick={() => setPage("progressStart")}>
              Keep Reading
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <span className="text-muted-foreground text-xs">Version 1.0.0</span>
        </div>
        <span className="text-muted-foreground text-xs">
          Made with ❤️ for ALU
        </span>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthUIProvider authClient={authClient}>
      <MainApp />
    </AuthUIProvider>
  );
}
