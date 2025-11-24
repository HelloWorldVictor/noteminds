import NotemindLogo from "@/assets/icon.png";
import { NotesTab } from "@/components/inc/tabs/notes-tab";
import { QuizTab } from "@/components/inc/tabs/quiz-tab";
import { ResourcesTab } from "@/components/inc/tabs/resources-tab";
import { SummaryTab } from "@/components/inc/tabs/summary-tab";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
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
import {
  XIcon,
  ArrowLeft,
  Loader2,
  Search,
  FileText,
  StickyNote,
  Zap,
  Brain,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { HomeTab } from "./tabs/home-tab";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { Summary, UserNote, Flashcard, Quiz } from "@/lib/types";
import { useContentStore } from "@/lib/store";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

interface SearchResults {
  summaries: Summary[];
  notes: UserNote[];
  flashcards: Flashcard[];
  quizzes: Quiz[];
}

interface SearchResponse {
  success: boolean;
  query: string;
  totalResults: number;
  data: SearchResults;
}

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
  // {
  //   id: "library",
  //   label: "Library",
  //   icon: FolderOpen,
  //   content: <ResourcesTab />,
  // },
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
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null
  );
  const [totalResults, setTotalResults] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const time = timeFormat.format(new Date());
  const { webpageTitle } = useContentStore();

  // Listen for navigation events from other components
  useEffect(() => {
    const handleNavigateTab = (event: CustomEvent) => {
      const { tab } = event.detail;
      setActiveTab(tab);
      setIsSearchMode(false); // Exit search mode when navigating
    };

    window.addEventListener(
      "noteminds:navigate-tab",
      handleNavigateTab as EventListener
    );

    return () => {
      window.removeEventListener(
        "noteminds:navigate-tab",
        handleNavigateTab as EventListener
      );
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:4137/search?q=${encodeURIComponent(searchQuery)}${
          activeFilter !== "all" ? `&type=${activeFilter}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${await (await import("@/lib/auth-storage")).authTokenStorage.getValue()}`,
          },
        }
      );

      const data: SearchResponse = await response.json();
      if (data.success) {
        setSearchResults(data.data);
        setTotalResults(data.totalResults);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleExitSearch = () => {
    setIsSearchMode(false);
    setSearchQuery("");
    setSearchResults(null);
    setTotalResults(0);
    setActiveFilter("all");
  };

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Intl.DateTimeFormat("en-GB", {
      month: "short",
      day: "numeric",
    }).format(new Date(timestamp));
  };

  const getResultCount = (type: string) => {
    if (!searchResults) return 0;
    switch (type) {
      case "summary":
        return searchResults.summaries.length;
      case "note":
        return searchResults.notes.length;
      case "flashcard":
        return searchResults.flashcards.length;
      case "quiz":
        return searchResults.quizzes.length;
      default:
        return totalResults;
    }
  };

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
                <p className="text-sidebar-foreground/70 line-clamp-1 text-xs">
                  {webpageTitle || "No page loaded"}
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
          {isSearchMode ? (
            /* Search Mode View */
            <div className="space-y-4">
              {/* Back Button + Search Input */}
              <div className="space-y-3">
                <Button size="icon" onClick={handleExitSearch}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Tabs</span>
                </Button>

                <div className="space-y-2">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      placeholder="Search summaries, notes, quizzes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className="w-full"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults ? (
                <div className="space-y-4">
                  {/* Results Count */}
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                      Found{" "}
                      <span className="text-foreground font-semibold">
                        {totalResults}
                      </span>{" "}
                      result
                      {totalResults !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button
                      variant={activeFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("all")}
                    >
                      All ({totalResults})
                    </Button>
                    <Button
                      variant={
                        activeFilter === "summary" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveFilter("summary")}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      {searchResults.summaries.length}
                    </Button>
                    <Button
                      variant={activeFilter === "note" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("note")}
                    >
                      <StickyNote className="mr-1 h-3 w-3" />
                      {searchResults.notes.length}
                    </Button>
                    <Button
                      variant={activeFilter === "quiz" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter("quiz")}
                    >
                      <Brain className="mr-1 h-3 w-3" />
                      {searchResults.quizzes.length}
                    </Button>
                    <Button
                      variant={
                        activeFilter === "flashcard" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveFilter("flashcard")}
                    >
                      <Zap className="mr-1 h-3 w-3" />
                      {searchResults.flashcards.length}
                    </Button>
                  </div>

                  {/* Results List */}
                  <div className="space-y-2">
                    {totalResults === 0 ? (
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Search />
                          </EmptyMedia>
                          <EmptyTitle>No Results Found</EmptyTitle>
                          <EmptyDescription>
                            Try different keywords
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    ) : (
                      <>
                        {(activeFilter === "all" ||
                          activeFilter === "summary") &&
                          searchResults.summaries.length > 0 && (
                            <div className="space-y-2">
                              {activeFilter === "all" && (
                                <h4 className="text-muted-foreground text-xs font-semibold">
                                  SUMMARIES
                                </h4>
                              )}
                              {searchResults.summaries.map((summary) => (
                                <Card
                                  key={summary.id}
                                  className="border-border bg-background/60 p-0"
                                >
                                  <Item className="rounded-xl border-0 px-4 py-3">
                                    <ItemContent>
                                      <ItemTitle>{summary.title}</ItemTitle>
                                      <ItemDescription className="line-clamp-2">
                                        {summary.content}
                                      </ItemDescription>
                                      <div className="mt-1 flex items-center gap-2">
                                        <UIBadge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          {summary.type}
                                        </UIBadge>
                                        <span className="text-muted-foreground text-xs">
                                          {formatDate(summary.createdAt)}
                                        </span>
                                      </div>
                                    </ItemContent>
                                  </Item>
                                </Card>
                              ))}
                            </div>
                          )}

                        {(activeFilter === "all" || activeFilter === "note") &&
                          searchResults.notes.length > 0 && (
                            <div className="space-y-2">
                              {activeFilter === "all" && (
                                <h4 className="text-muted-foreground text-xs font-semibold">
                                  NOTES
                                </h4>
                              )}
                              {searchResults.notes.map((note) => (
                                <Card
                                  key={note.id}
                                  className="border-border bg-background/60 p-0"
                                >
                                  <Item className="rounded-xl border-0 px-4 py-3">
                                    <ItemContent>
                                      <ItemDescription className="line-clamp-3">
                                        {note.content}
                                      </ItemDescription>
                                      <span className="text-muted-foreground mt-1 block text-xs">
                                        {formatDate(note.updatedAt)}
                                      </span>
                                    </ItemContent>
                                  </Item>
                                </Card>
                              ))}
                            </div>
                          )}

                        {(activeFilter === "all" || activeFilter === "quiz") &&
                          searchResults.quizzes.length > 0 && (
                            <div className="space-y-2">
                              {activeFilter === "all" && (
                                <h4 className="text-muted-foreground text-xs font-semibold">
                                  QUIZZES
                                </h4>
                              )}
                              {searchResults.quizzes.map((quiz) => (
                                <Card
                                  key={quiz.id}
                                  className="border-border bg-background/60 p-0"
                                >
                                  <Item className="rounded-xl border-0 px-4 py-3">
                                    <ItemContent>
                                      <ItemTitle>{quiz.title}</ItemTitle>
                                      <ItemDescription>
                                        {quiz.questions.length} questions
                                      </ItemDescription>
                                      <span className="text-muted-foreground mt-1 block text-xs">
                                        {formatDate(quiz.createdAt)}
                                      </span>
                                    </ItemContent>
                                  </Item>
                                </Card>
                              ))}
                            </div>
                          )}

                        {(activeFilter === "all" ||
                          activeFilter === "flashcard") &&
                          searchResults.flashcards.length > 0 && (
                            <div className="space-y-2">
                              {activeFilter === "all" && (
                                <h4 className="text-muted-foreground text-xs font-semibold">
                                  FLASHCARDS
                                </h4>
                              )}
                              {searchResults.flashcards.map((card) => (
                                <Card
                                  key={card.id}
                                  className="border-border bg-background/60 p-0"
                                >
                                  <Item className="rounded-xl border-0 px-4 py-3">
                                    <ItemContent>
                                      <ItemTitle className="text-sm">
                                        {card.front}
                                      </ItemTitle>
                                      <ItemDescription className="line-clamp-2">
                                        {card.back}
                                      </ItemDescription>
                                      <span className="text-muted-foreground mt-1 block text-xs">
                                        Reviewed {card.practiceCount} times
                                      </span>
                                    </ItemContent>
                                  </Item>
                                </Card>
                              ))}
                            </div>
                          )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Search />
                    </EmptyMedia>
                    <EmptyTitle>Search Your Content</EmptyTitle>
                    <EmptyDescription>
                      Find summaries, notes, quizzes, and flashcards
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          ) : (
            /* Normal Tabs View */
            <>
              <InputGroup>
                <InputGroupInput
                  placeholder="Search notes, summaries..."
                  onClick={() => setIsSearchMode(true)}
                  readOnly
                />
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
            </>
          )}
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
