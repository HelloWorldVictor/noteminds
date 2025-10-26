import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Sparkles,
  Link2,
  Brain,
  StickyNote,
  Clock,
  CheckCircle2,
  Loader2,
  BrainCircuitIcon,
  XIcon,
} from "lucide-react";
import { SummaryTab } from "@/components/inc/tabs/summary-tab";
import { ResourcesTab } from "@/components/inc/tabs/resources-tab";
import { QuizTab } from "@/components/inc/tabs/quiz-tab";
import { NotesTab } from "@/components/inc/tabs/notes-tab";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotemindsButton } from "@/components/inc/noteminds-button";

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  console.log("Rendering Sidebar App with activeTab:", activeTab);
  return (
    <>
      <div id="new-portal-for-all"></div>
      <TooltipProvider>
        <NotemindsButton isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <SidebarProvider
          className="absolute right-0 top-0 bottom-0 h-full"
          style={
            {
              "--sidebar-width": "24rem",
              "--sidebar-width-mobile": "24rem",
            } as React.CSSProperties
          }
          open={sidebarOpen}
        >
          <Sidebar side="right" variant="sidebar" className="border-l ">
            <SidebarHeader className="border-b border-sidebar-border bg-sidebar px-4 py-3">
              <div className=" flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
                    <BrainCircuitIcon className="h-4 w-4 text-sidebar-primary-foreground" />
                  </div>
                  <div className="flex-1 group-data-[collapsible=icon]:hidden">
                    <h1 className="text-base font-semibold text-sidebar-foreground">
                      Noteminds
                    </h1>
                    <p className="text-xs text-sidebar-foreground/70">
                      Smart Reading Assistant
                    </p>
                  </div>
                </div>
                <Button size="icon-sm" variant="ghost" onClick={toggleSidebar}>
                  <XIcon className="size-4" />
                </Button>
              </div>
            </SidebarHeader>

            <div className="border-b border-sidebar-border bg-sidebar-accent/30 px-4 py-2.5 group-data-[collapsible=icon]:px-2">
              <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                <div className="flex items-center gap-2">
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-sidebar-primary" />
                      <span className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                        Processing...
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <span className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                        Ready
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                  <Clock className="h-3.5 w-3.5" />
                  <span>5 min</span>
                </div>
              </div>
            </div>

            <SidebarContent className="bg-sidebar">
              <SidebarGroup>
                <SidebarGroupLabel className="px-2 text-xs font-medium text-sidebar-foreground/70">
                  Study Tools
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "summary"}
                        onClick={() => setActiveTab("summary")}
                        tooltip="Summary"
                        className="gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Summary</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "resources"}
                        onClick={() => setActiveTab("resources")}
                        tooltip="Resources"
                        className="gap-2"
                      >
                        <Link2 className="h-4 w-4" />
                        <span>Resources</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "quiz"}
                        onClick={() => setActiveTab("quiz")}
                        tooltip="Study"
                        className="gap-2"
                      >
                        <Brain className="h-4 w-4" />
                        <span>Study</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "notes"}
                        onClick={() => setActiveTab("notes")}
                        tooltip="Notes"
                        className="gap-2"
                      >
                        <StickyNote className="h-4 w-4" />
                        <span>Notes</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <div className="flex-1 px-4 py-2 group-data-[collapsible=icon]:hidden">
                <ScrollArea className="h-full">
                  {activeTab === "summary" && <SummaryTab />}
                  {activeTab === "resources" && <ResourcesTab />}
                  {activeTab === "quiz" && <QuizTab />}
                  {activeTab === "notes" && <NotesTab />}
                </ScrollArea>
              </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border bg-sidebar-accent/30 p-3 group-data-[collapsible=icon]:p-2">
              <p className="text-center text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
                Built for ALU Students
              </p>
            </SidebarFooter>

            <SidebarRail />
          </Sidebar>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
}
