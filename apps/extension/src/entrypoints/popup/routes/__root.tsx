import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  console.log("href", window.location.href);

  return (
    <main className="min-h-screen min-w-[420px] font-sans">
      <Outlet />
      <div className="mt-4 flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <span className="text-muted-foreground text-xs">Version 1.0.0</span>
        </div>
        <span className="text-muted-foreground text-xs">
          Made with ❤️ for ALU
        </span>
      </div>
    </main>
  );
}
