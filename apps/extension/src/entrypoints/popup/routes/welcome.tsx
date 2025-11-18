import { AuthDialog } from "@/components/inc/auth-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import "@/styles/globals.css";
import { createFileRoute } from "@tanstack/react-router";
import NotemindLogo from "@/assets/icon.png";
import { useTheme } from "@/components/inc/theme-provider";
import { Moon, Sun } from "lucide-react";
export const Route = createFileRoute("/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  const { theme, setTheme } = useTheme();

  function handleThemeToggle() {
    // Check system preference for default behavior
    const systemIsDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (theme === "system") {
      // If system theme, toggle to opposite of system preference
      setTheme(systemIsDark ? "light" : "dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h3 className="text-base font-semibold">NoteMinds</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="h-8 w-8"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <img src="/alu.png" alt="NoteMinds Logo" className="h-10 w-auto" />
        </div>
      </div>
      <div className="px-4 text-center">
        <img
          src={NotemindLogo}
          alt="NoteMinds Logo"
          className="mx-auto mb-4 size-16"
        />
        <h3 className="text-base font-semibold">Welcome to NoteMinds 🌟</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Your AI reading assistant ready to help you <b>learn smarter.</b>{" "}
          Summarize, generate quizzes and flashcards, save resources, and take
          notes while you read — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {[
          { i: "🧠", h: "Smart Summaries", p: "Get concise page recaps" },
          { i: "❓", h: "Quick Quizzes", p: "Test your understanding" },
          { i: "📝", h: "Context Notes", p: "Take notes while reading" },
          { i: "🔗", h: "Save Resources", p: "Keep resources organized" },
        ].map((c) => (
          <div
            key={c.h}
            className="rounded-(--radius) border p-4 px-5 text-center"
          >
            <div className="mb-4 text-2xl">{c.i}</div>
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-sm font-semibold">{c.h}</h3>
              <p className="text-muted-foreground text-xs">{c.p}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 px-4">
        <AuthDialog>
          <Button className="w-full">Authenticate</Button>
        </AuthDialog>
        <p className="text-muted-foreground text-center text-xs">
          Sign in to save your progress and sync across devices
        </p>
      </div>
    </div>
  );
}
