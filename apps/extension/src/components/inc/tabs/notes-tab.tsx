import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Plus, Trash2, Edit2, Save } from "lucide-react";

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
    <div className="space-y-4">
      {/* Add Note Section */}
      {isAdding ? (
        <Card className="p-4">
          <Textarea
            placeholder="Write your note here..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="mb-3 min-h-[100px] resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAddNote}
              className="flex-1 gap-1 bg-primary text-primary-foreground"
            >
              <Save className="h-3.5 w-3.5" />
              Save Note
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewNote("");
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAdding(true)}
          className="w-full gap-2 bg-primary text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add New Note
        </Button>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Your Notes</h3>
          <Badge variant="secondary">{notes.length} notes</Badge>
        </div>

        {notes.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <StickyNote className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No notes yet</p>
            <p className="text-xs text-muted-foreground">
              Start taking notes while you read
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <Card key={note.id} className="group p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="text-pretty text-sm leading-relaxed text-foreground">
                    {note.content}
                  </p>
                  <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {note.timestamp}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {notes.length > 0 && (
        <Card className="p-4">
          <h4 className="mb-3 text-sm font-semibold text-foreground">
            Quick Actions
          </h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm bg-transparent"
            >
              Export All Notes
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-sm bg-transparent"
            >
              Search Notes
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
