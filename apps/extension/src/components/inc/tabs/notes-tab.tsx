import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  StickyNote,
  Plus,
  Trash2,
  Edit2,
  Save,
  MoreHorizontal,
  Loader2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useContentStore } from "@/lib/store";
import { $api } from "@/lib/api";
import type { UserNote, ApiResponse } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NotesTab() {
  const { webpageId } = useContentStore();
  const [newNote, setNewNote] = useState("");
  const [selectedNote, setSelectedNote] = useState<UserNote | null>(null);
  const [editingNote, setEditingNote] = useState<UserNote | null>(null);
  const [editContent, setEditContent] = useState("");

  // Fetch notes for the webpage
  const {
    data,
    isLoading: isFetching,
    refetch,
  } = $api.useQuery(
    "get",
    "/note/webpage/{webpageId}",
    {
      params: {
        path: {
          webpageId: webpageId || "",
        },
      },
    },
    {
      enabled: !!webpageId,
    }
  );

  const notes = ((data as unknown as ApiResponse<UserNote[]>)?.data || []).sort(
    (a, b) => b.createdAt - a.createdAt
  );

  // Create note mutation
  const createNoteMutation = $api.useMutation("post", "/note/");

  // Update note mutation
  const updateNoteMutation = $api.useMutation("patch", "/note/{id}");

  // Delete note mutation
  const deleteNoteMutation = $api.useMutation("delete", "/note/{id}");

  const handleAddNote = async () => {
    if (!newNote.trim() || !webpageId) return;

    try {
      await createNoteMutation.mutateAsync({
        body: {
          webpageId,
          content: newNote,
        },
      });
      setNewNote("");
      const result = await refetch();
      const newNotes = (
        (result.data as unknown as ApiResponse<UserNote[]>)?.data || []
      ).sort((a, b) => b.createdAt - a.createdAt);
      if (newNotes.length > 0) {
        setSelectedNote(newNotes[0]);
      }
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNoteMutation.mutateAsync({
        params: {
          path: { id },
        },
      });
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
      refetch();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleEditNote = (note: UserNote) => {
    setEditingNote(note);
    setEditContent(note.content);
    setSelectedNote(note);
  };

  const handleSaveEdit = async () => {
    if (!editingNote || !editContent.trim()) return;

    try {
      const noteId = editingNote.id;
      await updateNoteMutation.mutateAsync({
        params: {
          path: { id: noteId },
        },
        body: {
          content: editContent,
        },
      });
      setEditingNote(null);
      setEditContent("");
      const result = await refetch();
      const newNotes =
        (result.data as unknown as ApiResponse<UserNote[]>)?.data || [];
      const updatedNote = newNotes.find((n) => n.id === noteId);
      if (updatedNote) {
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent("");
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

  const handleSelectNote = (note: UserNote) => {
    if (editingNote?.id === note.id) return;
    setSelectedNote(note);
  };

  return (
    <div className="space-y-4">
      {!webpageId ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <StickyNote />
            </EmptyMedia>
            <EmptyTitle>No Webpage Loaded</EmptyTitle>
            <EmptyDescription>
              Navigate to a webpage to take notes
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {/* Focused Note View */}
          {selectedNote && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-2">
                  <StickyNote className="size-4" />
                  <span className="text-sm font-medium">
                    {editingNote?.id === selectedNote.id
                      ? "Editing Note"
                      : "Note"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setSelectedNote(null);
                    handleCancelEdit();
                  }}
                >
                  <X className="size-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {editingNote?.id === selectedNote.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[200px] resize-none text-sm"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={
                            updateNoteMutation.isPending || !editContent.trim()
                          }
                        >
                          {updateNoteMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 size-3.5 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 size-3.5" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedNote.content}
                      </p>
                      <div className="flex items-center justify-between border-t pt-2">
                        <div className="text-muted-foreground flex items-center gap-3 text-xs">
                          <span>
                            Created {formatDate(selectedNote.createdAt)}
                          </span>
                          {selectedNote.updatedAt !==
                            selectedNote.createdAt && (
                            <>
                              <span>•</span>
                              <span>
                                Edited {formatDate(selectedNote.updatedAt)}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditNote(selectedNote)}
                          >
                            <Edit2 className="mr-1.5 size-3.5" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteNote(selectedNote.id)}
                            disabled={deleteNoteMutation.isPending}
                          >
                            {deleteNoteMutation.isPending ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Quick Note Section */}
          <div className="border-border rounded-lg border-2 border-dashed bg-transparent p-4 shadow-none">
            <h2 className="text-foreground mb-2 text-sm font-semibold">
              Quick note
            </h2>
            <Textarea
              placeholder="Jot something down...."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="placeholder:text-muted-foreground min-h-[100px] resize-none border bg-transparent p-3 text-sm focus-visible:ring-0"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                Tip: Press ⌘J to save
              </span>
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNote.trim() || createNoteMutation.isPending}
                className="bg-noir text-noir-foreground gap-1.5 rounded-full"
              >
                {createNoteMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                Save note
              </Button>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-sm font-semibold">
                My Notes
              </h3>
              {notes.length > 0 && (
                <Badge variant="secondary">{notes.length} notes</Badge>
              )}
            </div>

            {isFetching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground size-6 animate-spin" />
              </div>
            ) : notes.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <StickyNote />
                  </EmptyMedia>
                  <EmptyTitle>No Notes Yet</EmptyTitle>
                  <EmptyDescription>
                    Start taking notes while you read
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="space-y-2">
                {notes.map((note) => (
                  <Card
                    key={note.id}
                    className={`border-border bg-background/60 hover:bg-background cursor-pointer border p-0 shadow-none transition-colors ${
                      selectedNote?.id === note.id
                        ? "ring-primary/50 ring-2"
                        : ""
                    }`}
                    onClick={() => handleSelectNote(note)}
                  >
                    <Item className="group rounded-xl border-0 px-4 py-3">
                      <ItemContent>
                        <ItemDescription className="line-clamp-3 whitespace-pre-wrap">
                          {note.content}
                        </ItemDescription>
                        <span className="text-muted-foreground mt-2 block text-xs">
                          {note.updatedAt !== note.createdAt
                            ? "Edited"
                            : "Created"}{" "}
                          • {formatDate(note.updatedAt)}
                        </span>
                      </ItemContent>
                      <ItemActions className="self-start">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-36"
                            contentScript
                          >
                            <DropdownMenuItem
                              className="gap-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditNote(note);
                              }}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              Edit note
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive gap-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNote(note.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </ItemActions>
                    </Item>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
