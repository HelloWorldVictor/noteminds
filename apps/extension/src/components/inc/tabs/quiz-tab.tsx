import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export function QuizTab() {
  const [activeStudyTab, setActiveStudyTab] = useState("quiz");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  return (
    <div className="space-y-4">
      {/* Study Mode Selector */}
      <Tabs value={activeStudyTab} onValueChange={setActiveStudyTab}>
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger value="quiz" className="gap-1.5">
            <Brain className="h-3.5 w-3.5" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            Flashcards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="mt-4 space-y-4">
          {/* Quiz Stats */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 text-center">
              <div className="text-lg font-bold text-foreground">5</div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg font-bold text-success">3</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg font-bold text-primary">60%</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </Card>
          </div>

          {/* Current Question */}
          <Card className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <Badge variant="secondary">Question 4 of 5</Badge>
              <Badge className="bg-primary text-primary-foreground">
                <Sparkles className="mr-1 h-3 w-3" />
                AI Generated
              </Badge>
            </div>
            <h3 className="mb-4 text-pretty text-sm font-semibold leading-relaxed text-foreground">
              What is the primary difference between supervised and unsupervised
              learning?
            </h3>
            <div className="space-y-2">
              {[
                "Supervised learning uses labeled data, while unsupervised learning uses unlabeled data",
                "Supervised learning is faster than unsupervised learning",
                "Unsupervised learning requires more computational power",
                "There is no significant difference between them",
              ].map((answer, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full justify-start text-left text-sm ${
                    selectedAnswer === index
                      ? index === 0
                        ? "border-success bg-success/10 text-success"
                        : "border-destructive bg-destructive/10 text-destructive"
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-xs">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-pretty">{answer}</span>
                  {showResult && index === 0 && (
                    <CheckCircle2 className="ml-auto h-4 w-4" />
                  )}
                  {showResult && selectedAnswer === index && index !== 0 && (
                    <XCircle className="ml-auto h-4 w-4" />
                  )}
                </Button>
              ))}
            </div>
            {showResult && (
              <div className="mt-4 rounded-lg bg-muted p-3">
                <p className="text-pretty text-xs text-foreground/80">
                  <strong className="text-foreground">Explanation:</strong>{" "}
                  Supervised learning algorithms learn from labeled training
                  data, where each example includes both input features and the
                  correct output. Unsupervised learning works with unlabeled
                  data to find patterns and structures.
                </p>
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Reset Quiz
            </Button>
            <Button className="flex-1 bg-primary text-primary-foreground">
              Next Question
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="flashcards" className="mt-4 space-y-4">
          {/* Flashcard Stats */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-3 text-center">
              <div className="text-lg font-bold text-foreground">12</div>
              <div className="text-xs text-muted-foreground">Total Cards</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-lg font-bold text-primary">8</div>
              <div className="text-xs text-muted-foreground">Reviewed</div>
            </Card>
          </div>

          {/* Flashcard */}
          <Card className="relative min-h-[280px] cursor-pointer p-6 transition-transform hover:scale-[1.02]">
            <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">
              Card 9/12
            </Badge>
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Neural Network
              </h3>
              <p className="text-pretty text-sm text-foreground/80">
                A computing system inspired by biological neural networks that
                learns to perform tasks by considering examples, without being
                programmed with task-specific rules.
              </p>
              <p className="mt-4 text-xs text-muted-foreground">Tap to flip</p>
            </div>
          </Card>

          {/* Flashcard Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="gap-1 bg-transparent">
              <XCircle className="h-4 w-4 text-destructive" />
              Hard
            </Button>
            <Button variant="outline" className="gap-1 bg-transparent">
              <RotateCcw className="h-4 w-4 text-warning" />
              Good
            </Button>
            <Button variant="outline" className="gap-1 bg-transparent">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Easy
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
