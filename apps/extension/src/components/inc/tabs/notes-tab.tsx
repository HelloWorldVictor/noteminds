import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Note {
  id: number;
  content: string;
  timestamp: string;
  tags: string[];
}

export function NotesTab() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      content:
        "Neural networks consist of layers of interconnected nodes. Each connection has a weight that adjusts during training.",
      timestamp: "2 hours ago",
      tags: ["Neural Networks", "Key Concept"],
    },
    {
      id: 2,
      content:
        "Remember: Overfitting occurs when a model learns the training data too well, including noise and outliers.",
      timestamp: "1 day ago",
      tags: ["Important", "Overfitting"],
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now(),
        content: newNote,
        timestamp: "Just now",
        tags: ["New Note"],
      };
      setNotes([note, ...notes]);
      setNewNote("");
      setIsAdding(false);
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="space-y-6">
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
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            Tip: Press ⌘J to save
          </span>
          <Button
            size="sm"
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="bg-noir text-noir-foreground gap-1.5 rounded-full"
          >
            <Plus className="h-3.5 w-3.5" />
            Save note
          </Button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-sm font-semibold">My Notes</h3>
          <Badge variant="secondary">{notes.length} notes</Badge>
        </div>

        {notes.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="bg-muted mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <StickyNote className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-muted-foreground text-sm">No notes yet</p>
            <p className="text-muted-foreground text-xs">
              Start taking notes while you read
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="border-border bg-background/60 border p-0 shadow-none"
              >
                <Item className="group rounded-xl border-0 px-4 py-3">
                  <ItemContent>
                    <ItemTitle>Empathy map prompts</ItemTitle>
                    <ItemDescription className="line-clamp-2 whitespace-pre-wrap">
                      {note.content}
                    </ItemDescription>
                    <span className="text-muted-foreground text-xs">
                      Edited • {note.timestamp}
                    </span>
                  </ItemContent>
                  <ItemActions className="self-start">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-36"
                        contentScript
                      >
                        <DropdownMenuItem className="gap-2 text-xs">
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit note
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive gap-2 text-xs"
                          onClick={() => handleDeleteNote(note.id)}
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
    </div>
  );
}
