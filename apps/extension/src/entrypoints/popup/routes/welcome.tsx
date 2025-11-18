import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AuthDialog } from "@/components/inc/auth-dialog";
import { authClient } from "@/lib/auth-client";
import "@/styles/globals.css";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/welcome")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session, isPending } = authClient.useSession();

  // If user is already signed in, show different content
  if (session?.user) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-base font-semibold">NoteMinds</h3>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {session.user.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => authClient.signOut()}
            >
              Sign out
            </Button>
          </div>
        </div>
        <Separator />
        <div className="px-4 text-center">
          <div className="bg-primary text-primary-foreground mx-auto mb-2 flex h-[60px] w-[60px] items-center justify-center rounded-full text-2xl">
            <span>👋</span>
          </div>
          <h3 className="text-base font-semibold">
            Welcome back, {session.user.name}!
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Ready to continue learning? Start by processing a webpage or
            reviewing your saved content.
          </p>
        </div>
        <div className="px-4">
          <Button className="w-full">Continue Reading</Button>
        </div>
      </div>
    );
  }

  // Welcome screen for new/signed out users
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-base font-semibold">NoteMinds</h3>
        <img src="/alu.png" alt="NoteMinds Logo" className="h-[40px] w-auto" />
      </div>
      <Separator />
      <div className="px-4 text-center">
        <div className="bg-foreground text-background mx-auto mb-2 flex h-[60px] w-[60px] items-center justify-center rounded-full text-2xl">
          <span>📖</span>
        </div>
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
          <Card key={c.h} className="p-4 text-center">
            <div className="text-2xl">{c.i}</div>
            <h3 className="mt-2 text-sm font-semibold">{c.h}</h3>
            <p className="text-muted-foreground text-xs">{c.p}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-2 px-4">
        <AuthDialog>
          <Button className="w-full" disabled={isPending}>
            {isPending ? "Loading..." : "Start Reading"}
          </Button>
        </AuthDialog>
        <p className="text-muted-foreground text-center text-xs">
          Sign in to save your progress and sync across devices
        </p>
      </div>
    </div>
  );
}
