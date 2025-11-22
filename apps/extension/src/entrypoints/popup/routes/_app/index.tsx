import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Flash, Notification, Setting4, Share } from "iconsax-reactjs";
import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "@/components/inc/theme-provider";
import { ExtensionMessaging } from "@/lib/messaging";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function RouteComponent() {
  const [autoSummarize, setAutoSummarize] = React.useState(true);
  const [reminders, setReminders] = React.useState(true);
  const { data } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const time = timeFormat.format(new Date());
  const navigate = Route.useNavigate();
  async function handleLogout() {
    navigate({ to: "/welcome" });
    await authClient.signOut();
    ExtensionMessaging.sendToAllTabs({
      type: "POPUP_LOGOUT",
    });
  }

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
  if (!data) {
    return <div className="flex"></div>;
  }
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between border-b px-3 pt-4 pb-2">
        <div>
          <h1 className="text-base font-semibold">Welcome 👋</h1>
          <p className="text-muted-foreground text-xs">
            You’re reading better with NoteMinds
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          <Badge variant="outline">{time}</Badge>
          <small className="text-muted-foreground text-xs"></small>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost">
                <Setting4 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              // side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={data.user?.image ?? ""}
                      alt={data.user.name}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleThemeToggle}>
                  {theme === "dark" ? <Sun /> : <Moon />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="bg-destructive/10 hover:bg-destructive/20! text-destructive hover:text-destructive/80!"
              >
                <LogOut className="text-inherit" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex gap-3 px-3">
        <Card className="flex-1 gap-4 px-3 py-4 text-center shadow-none">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold">Reading</h2>
            <Badge variant="secondary">Goal 1h</Badge>
          </div>
          <div className="flex items-center justify-center gap-3 *:flex-1">
            <div className="grid place-items-center">
              <ProgressCircle value={65} size={60} strokeWidth={6} />
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold">42m</h3>
              <p className="text-muted-foreground text-xs">70% of daily goal</p>
            </div>
          </div>
        </Card>

        <Card className="w-1/2 gap-4 p-4 text-center shadow-none">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold">Understanding</h4>
            <Badge className="bg-notemind-green">+5%</Badge>
          </div>
          <div className="grid grid-cols-3">
            <div className="mb-1 flex items-center justify-center gap-2">
              <h3 className="text-base font-semibold">85%</h3>
            </div>
            <div className="col-span-2">
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <Line
                    dataKey="desktop"
                    type="bumpX"
                    stroke="var(--notemind-green)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
            <p className="text-muted-foreground col-span-3 text-left">
              Avg quiz score last 6 sessions
            </p>
          </div>
        </Card>
      </div>
      <div className="space-y-3 px-3">
        <Card className="p-3 shadow-none">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Active Learning</h2>
            <Badge variant="secondary">Your first session</Badge>
          </div>
          <div className="flex">
            <div className="grid grid-cols-[auto_1fr] gap-x-1 pr-2">
              <span className="row-span-2 text-4xl">📝</span>
              <span className="text-sm font-semibold">2</span>
              <span className="text-muted-foreground text-xs">Notes</span>
            </div>
            <div className="bg-muted-foreground/50 mx-1 w-px"></div>
            <div className="grid grid-cols-[auto_1fr] gap-x-1">
              <span className="row-span-2 text-4xl">✨</span>
              <span className="text-sm font-semibold">1</span>
              <span className="text-muted-foreground text-xs">Summaries</span>
            </div>
          </div>
        </Card>
        <Card className="bg-muted rounded-xl px-3 py-2 shadow-none">
          <p>
            <span className="font-bold">💡 Tip: </span> Highlight a paragraph to
            generate a summary or quick quiz on the spot
          </p>
        </Card>
      </div>

      <div className="mx-3 border-t p-3">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-sm font-semibold">Active Learning</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-muted grid size-7 place-items-center rounded-full">
                <Flash size={18} />
              </div>
              <label className="text-sm">Auto-Summarize</label>
            </div>
            <Switch
              checked={autoSummarize}
              onCheckedChange={setAutoSummarize}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-muted grid size-7 place-items-center rounded-full">
                <Notification size={18} />
              </div>
              <label className="text-sm"> Study Reminders</label>
            </div>
            <Switch checked={reminders} onCheckedChange={setReminders} />
          </div>
        </div>
      </div>

      <div className="flex gap-2 px-3">
        <Button variant="outline" className="w-1/2">
          Review Notes
        </Button>
        <Button className="w-1/2">Keep Reading</Button>
      </div>
    </div>
  );
}

function ProgressCircle({
  value = 50,
  size = 70,
  strokeWidth = 8,
}: {
  value?: number;
  size?: number;
  strokeWidth?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = cx - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = `${circumference} ${circumference}`;
  const dashOffset = circumference - (value / 100) * circumference;
  return (
    <div
      className="relative mx-auto mb-2"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          className="stroke-muted-foreground/20 fill-none"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          className="stroke-notemind-green fill-none transition-all duration-500 ease-in-out"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }}
        />
      </svg>
      <div
        className="text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold"
        style={{ fontSize: Math.max(10, size * 0.18) }}
      >
        {value}%
      </div>
    </div>
  );
}
