import NotemindLogo from "@/assets/icon.png";
import { NotesTab } from "@/components/inc/tabs/notes-tab";
import { QuizTab } from "@/components/inc/tabs/quiz-tab";
import { ResourcesTab } from "@/components/inc/tabs/resources-tab";
import { SummaryTab } from "@/components/inc/tabs/summary-tab";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DocumentText,
  Flash,
  FolderOpen,
  Home2,
  MessageQuestion,
  SearchNormal,
  Setting,
} from "iconsax-reactjs";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { HomeTab } from "./tabs/home-tab";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const tabs = [
  {
    id: "home",
    label: "Home",
    icon: Home2,
    content: <HomeTab />,
  },
  {
    id: "summaries",
    label: "Summaries",
    icon: Flash,
    content: <SummaryTab />,
  },
  {
    id: "notes",
    label: "Notes",
    icon: DocumentText,
    content: <NotesTab />,
  },
  {
    id: "quiz",
    label: "Quiz",
    icon: MessageQuestion,
    content: <QuizTab />,
  },
  {
    id: "library",
    label: "Library",
    icon: FolderOpen,
    content: <ResourcesTab />,
  },
];
export function AppSidebar({
  sidebarOpen,
  toggleSidebar,
}: {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const time = timeFormat.format(new Date());

  return (
    <SidebarProvider
      className="absolute top-0 right-0 bottom-0 h-full"
      style={
        {
          "--sidebar-width": "26rem",
          "--sidebar-width-mobile": "26rem",
        } as React.CSSProperties
      }
      open={sidebarOpen}
    >
      <Sidebar side="right" variant="sidebar" className="z-99999 border-l">
        <SidebarHeader className="border-sidebar-border bg-sidebar border-b px-4 py-3">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={NotemindLogo}
                alt="NoteMinds Logo"
                className="size-10"
              />
              <div className="flex-1 group-data-[collapsible=icon]:hidden">
                <h1 className="text-sidebar-foreground text-base font-semibold">
                  Noteminds
                </h1>
                <p className="text-sidebar-foreground/70 text-xs">
                  ALU: Design Thinking – Week 1
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Badge variant="outline">{time}</Badge>
              <Button size="icon-sm" variant="ghost" onClick={toggleSidebar}>
                <XIcon className="size-4" />
              </Button>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 pt-6">
          <InputGroup>
            <InputGroupInput placeholder="Search notes, summaries..." />
            <InputGroupAddon>
              <SearchNormal />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <Tabs value={activeTab} className="mt-4">
            <TabsList className="mb-4 gap-2">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="data-[state=active]:bg-noir data-[state=active]:text-noir-foreground dark:data-[state=active]:bg-noir dark:data-[state=active]:text-noir-foreground transition ease-in-out"
                >
                  {activeTab === tab.id && (
                    <tab.icon size={18} className="fade-in fade-out" />
                  )}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </SidebarContent>

        <SidebarFooter className="border-sidebar-border border-t p-3 group-data-[collapsible=icon]:p-2">
          <div className="space-y-2 text-xs group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-2">
              <Setting className="size-4.5" />
              <p className="font-meidum">
                <span>Use</span> <Kbd>⌘⇧S</Kbd>{" "}
                <span>to summarize the current page.</span>
              </p>
            </div>
            <div className="flex items-center justify-between font-medium">
              <div className="flex items-center gap-2">
                <MessageQuestion className="size-4.5" />
                <span>Help & Shortcuts</span>
              </div>
              <span>Privacy</span>
            </div>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
