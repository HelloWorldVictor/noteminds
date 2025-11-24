import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Search,
  Loader2,
  FileText,
  StickyNote,
  Zap,
  Brain,
  X,
} from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { $api } from "@/lib/api";
import type { Summary, UserNote, Flashcard, Quiz } from "@/lib/types";

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

export function SearchTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null
  );
  const [totalResults, setTotalResults] = useState(0);

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

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setTotalResults(0);
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
    <div className="space-y-4">
      {/* Search Input */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search summaries, notes, quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pr-10 pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-2 -translate-y-1/2"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
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

      {/* Results */}
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
              {totalResults !== 1 ? "s" : ""} for "{searchQuery}"
            </p>
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs">
                All ({totalResults})
              </TabsTrigger>
              <TabsTrigger value="summary" className="text-xs">
                <FileText className="mr-1 h-3 w-3" />
                {searchResults.summaries.length}
              </TabsTrigger>
              <TabsTrigger value="note" className="text-xs">
                <StickyNote className="mr-1 h-3 w-3" />
                {searchResults.notes.length}
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-xs">
                <Brain className="mr-1 h-3 w-3" />
                {searchResults.quizzes.length}
              </TabsTrigger>
              <TabsTrigger value="flashcard" className="text-xs">
                <Zap className="mr-1 h-3 w-3" />
                {searchResults.flashcards.length}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-2">
              {totalResults === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Search />
                    </EmptyMedia>
                    <EmptyTitle>No Results Found</EmptyTitle>
                    <EmptyDescription>
                      Try different keywords or filters
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <>
                  {searchResults.summaries.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-muted-foreground text-xs font-semibold">
                        SUMMARIES
                      </h4>
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
                                <Badge variant="secondary" className="text-xs">
                                  {summary.type}
                                </Badge>
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

                  {searchResults.notes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-muted-foreground text-xs font-semibold">
                        NOTES
                      </h4>
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

                  {searchResults.quizzes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-muted-foreground text-xs font-semibold">
                        QUIZZES
                      </h4>
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

                  {searchResults.flashcards.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-muted-foreground text-xs font-semibold">
                        FLASHCARDS
                      </h4>
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
            </TabsContent>

            {/* Individual Type Tabs */}
            {["summary", "note", "quiz", "flashcard"].map((type) => (
              <TabsContent key={type} value={type} className="mt-4 space-y-2">
                {getResultCount(type) === 0 ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Search />
                      </EmptyMedia>
                      <EmptyTitle>No {type}s Found</EmptyTitle>
                      <EmptyDescription>
                        Try a different search query
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <>
                    {type === "summary" &&
                      searchResults.summaries.map((summary) => (
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
                                <Badge variant="secondary" className="text-xs">
                                  {summary.type}
                                </Badge>
                                <span className="text-muted-foreground text-xs">
                                  {formatDate(summary.createdAt)}
                                </span>
                              </div>
                            </ItemContent>
                          </Item>
                        </Card>
                      ))}

                    {type === "note" &&
                      searchResults.notes.map((note) => (
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

                    {type === "quiz" &&
                      searchResults.quizzes.map((quiz) => (
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

                    {type === "flashcard" &&
                      searchResults.flashcards.map((card) => (
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
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
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
  );
}
