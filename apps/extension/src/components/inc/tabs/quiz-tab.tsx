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
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import type { Quiz, Flashcard, ApiResponse } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function QuizTab() {
  const { webpageId } = useContentStore();
  const [activeStudyTab, setActiveStudyTab] = useState("quiz");

  // Quiz state
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [showResults, setShowResults] = useState(false);

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Fetch quizzes
  const {
    data: quizData,
    isLoading: isLoadingQuizzes,
    refetch: refetchQuizzes,
  } = $api.useQuery(
    "get",
    "/quiz/webpage/{webpageId}",
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

  const quizzes = (
    (quizData as unknown as ApiResponse<Quiz[]>)?.data || []
  ).sort((a, b) => b.createdAt - a.createdAt);

  // Fetch flashcards
  const {
    data: flashcardData,
    isLoading: isLoadingFlashcards,
    refetch: refetchFlashcards,
  } = $api.useQuery(
    "get",
    "/flashcard/webpage/{webpageId}",
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

  const flashcards = (
    (flashcardData as unknown as ApiResponse<Flashcard[]>)?.data || []
  ).sort((a, b) => b.createdAt - a.createdAt);

  // Generate quiz mutation
  const generateQuizMutation = $api.useMutation("post", "/quiz/generate");

  // Generate flashcards mutation
  const generateFlashcardsMutation = $api.useMutation(
    "post",
    "/flashcard/generate"
  );

  // Practice flashcard mutation
  const practiceFlashcardMutation = $api.useMutation(
    "patch",
    "/flashcard/{id}/practice"
  );

  const handleGenerateQuiz = async (questionCount: number = 5) => {
    if (!webpageId) return;

    try {
      const result = await generateQuizMutation.mutateAsync({
        body: {
          webpageId,
          questionCount,
        },
      });
      const newQuizzes = await refetchQuizzes();
      const quizList = (
        (newQuizzes.data as unknown as ApiResponse<Quiz[]>)?.data || []
      ).sort((a, b) => b.createdAt - a.createdAt);
      if (quizList.length > 0) {
        setSelectedQuiz(quizList[0]);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowResults(false);
      }
    } catch (error) {
      console.error("Failed to generate quiz:", error);
    }
  };

  const handleGenerateFlashcards = async (count: number = 10) => {
    if (!webpageId) return;

    try {
      await generateFlashcardsMutation.mutateAsync({
        body: {
          webpageId,
          count,
        },
      });
      refetchFlashcards();
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error("Failed to generate flashcards:", error);
    }
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    if (!selectedQuiz) return { correct: 0, total: 0, percentage: 0 };

    let correct = 0;
    selectedQuiz.questions.forEach((q, idx) => {
      const selectedIdx = selectedAnswers[idx];
      if (
        selectedIdx !== undefined &&
        q.options[selectedIdx] === q.correctAnswer
      ) {
        correct++;
      }
    });

    return {
      correct,
      total: selectedQuiz.questions.length,
      percentage: Math.round((correct / selectedQuiz.questions.length) * 100),
    };
  };

  const handleFlashcardAction = async (
    difficulty: "hard" | "good" | "easy"
  ) => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    try {
      await practiceFlashcardMutation.mutateAsync({
        params: {
          path: { id: currentCard.id },
        },
      });

      // Move to next card
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
      } else {
        setCurrentCardIndex(0);
      }
      setIsFlipped(false);
      refetchFlashcards();
    } catch (error) {
      console.error("Failed to update practice count:", error);
    }
  };

  const currentQuestion = selectedQuiz?.questions[currentQuestionIndex];
  const currentCard = flashcards[currentCardIndex];
  const score = calculateScore();
  const progress = selectedQuiz
    ? ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100
    : 0;

  return (
    <div className="space-y-4">
      {!webpageId ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Brain />
            </EmptyMedia>
            <EmptyTitle>No Webpage Loaded</EmptyTitle>
            <EmptyDescription>
              Navigate to a webpage to generate quizzes and flashcards
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Tabs value={activeStudyTab} onValueChange={setActiveStudyTab}>
          <TabsList className="bg-muted grid w-full grid-cols-2">
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
            {isLoadingQuizzes ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="text-muted-foreground size-8 animate-spin" />
              </div>
            ) : !selectedQuiz && quizzes.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Brain />
                  </EmptyMedia>
                  <EmptyTitle>No Quizzes Yet</EmptyTitle>
                  <EmptyDescription>
                    Generate an AI quiz to test your knowledge
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    onClick={() => handleGenerateQuiz(5)}
                    disabled={generateQuizMutation.isPending}
                  >
                    {generateQuizMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Generating Quiz...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 size-4" />
                        Generate Quiz
                      </>
                    )}
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <>
                {/* Quiz Stats */}
                {selectedQuiz && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <Card className="p-3 text-center">
                        <div className="text-foreground text-lg font-bold">
                          {selectedQuiz.questions.length}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Questions
                        </div>
                      </Card>
                      <Card className="p-3 text-center">
                        <div className="text-success text-lg font-bold">
                          {showResults
                            ? score.correct
                            : Object.keys(selectedAnswers).length}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {showResults ? "Correct" : "Answered"}
                        </div>
                      </Card>
                      <Card className="p-3 text-center">
                        <div className="text-primary text-lg font-bold">
                          {showResults ? `${score.percentage}%` : "—"}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Score
                        </div>
                      </Card>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span>
                          {currentQuestionIndex + 1} of{" "}
                          {selectedQuiz.questions.length}
                        </span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    {/* Results Summary Card */}
                    {showResults && (
                      <Card className="from-primary/5 to-primary/10 border-primary/20 space-y-4 bg-linear-to-br p-6 text-center">
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            {score.percentage >= 70 ? (
                              <CheckCircle2 className="text-success h-8 w-8" />
                            ) : score.percentage >= 50 ? (
                              <Brain className="text-warning h-8 w-8" />
                            ) : (
                              <XCircle className="text-destructive h-8 w-8" />
                            )}
                          </div>
                          <h3 className="text-foreground text-2xl font-bold">
                            {score.percentage >= 70
                              ? "Great Job!"
                              : score.percentage >= 50
                                ? "Good Effort!"
                                : "Keep Practicing!"}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            You scored {score.correct} out of {score.total}{" "}
                            questions correctly
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-8 pt-2">
                          <div className="text-center">
                            <div className="text-primary text-3xl font-bold">
                              {score.percentage}%
                            </div>
                            <div className="text-muted-foreground text-xs">
                              Final Score
                            </div>
                          </div>
                          <div className="bg-border h-12 w-px"></div>
                          <div className="text-center">
                            <div className="text-success text-3xl font-bold">
                              {score.correct}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              Correct
                            </div>
                          </div>
                          <div className="bg-border h-12 w-px"></div>
                          <div className="text-center">
                            <div className="text-destructive text-3xl font-bold">
                              {score.total - score.correct}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              Wrong
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Current Question */}
                    {currentQuestion && !showResults && (
                      <Card className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <Badge variant="secondary">
                            Question {currentQuestionIndex + 1} of{" "}
                            {selectedQuiz.questions.length}
                          </Badge>
                          <Badge className="bg-primary text-primary-foreground">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Generated
                          </Badge>
                        </div>
                        <h3 className="text-foreground mb-4 text-sm leading-relaxed font-semibold text-pretty">
                          {currentQuestion.question}
                        </h3>
                        <div className="space-y-2">
                          {currentQuestion.options.map((option, idx) => {
                            const isSelected =
                              selectedAnswers[currentQuestionIndex] === idx;
                            const isCorrect =
                              option === currentQuestion.correctAnswer;
                            const showCorrect = showResults && isCorrect;
                            const showWrong =
                              showResults && isSelected && !isCorrect;

                            return (
                              <Button
                                key={idx}
                                variant="outline"
                                className={cn(
                                  "h-auto w-full justify-start py-3 text-left text-sm",
                                  isSelected &&
                                    !showResults &&
                                    "border-primary bg-primary/5",
                                  showCorrect &&
                                    "border-success bg-success/10 text-success",
                                  showWrong &&
                                    "border-destructive bg-destructive/10 text-destructive"
                                )}
                                onClick={() =>
                                  handleSelectAnswer(currentQuestionIndex, idx)
                                }
                                disabled={showResults}
                              >
                                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-medium">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="flex-1 text-pretty">
                                  {option}
                                </span>
                                {isSelected && !showResults && (
                                  <CheckCircle2 className="text-primary ml-2 h-4 w-4 shrink-0" />
                                )}
                                {showCorrect && (
                                  <CheckCircle2 className="ml-2 h-4 w-4 shrink-0" />
                                )}
                                {showWrong && (
                                  <XCircle className="ml-2 h-4 w-4 shrink-0" />
                                )}
                              </Button>
                            );
                          })}
                        </div>
                      </Card>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-2">
                      {!showResults ? (
                        <>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                          >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Previous
                          </Button>
                          {currentQuestionIndex ===
                          selectedQuiz.questions.length - 1 ? (
                            <Button
                              className="bg-primary text-primary-foreground flex-1"
                              onClick={handleSubmitQuiz}
                              disabled={
                                Object.keys(selectedAnswers).length !==
                                selectedQuiz.questions.length
                              }
                            >
                              Submit Quiz
                            </Button>
                          ) : (
                            <Button
                              className="bg-primary text-primary-foreground flex-1"
                              onClick={handleNextQuestion}
                            >
                              Next
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedQuiz(null)}
                          >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Exit
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleResetQuiz}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Retry
                          </Button>
                          <Button
                            className="bg-primary text-primary-foreground flex-1"
                            onClick={() => handleGenerateQuiz(5)}
                            disabled={generateQuizMutation.isPending}
                          >
                            {generateQuizMutation.isPending ? (
                              <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                              <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            New Quiz
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}

                {/* Quiz List */}
                {!selectedQuiz && quizzes.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">
                        Available Quizzes
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleGenerateQuiz(5)}
                        disabled={generateQuizMutation.isPending}
                      >
                        {generateQuizMutation.isPending ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="size-3.5" />
                        )}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {quizzes.map((quiz) => (
                        <Card
                          key={quiz.id}
                          className="hover:bg-accent cursor-pointer p-4 transition-colors"
                          onClick={() => {
                            setSelectedQuiz(quiz);
                            setCurrentQuestionIndex(0);
                            setSelectedAnswers({});
                            setShowResults(false);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium">
                                {quiz.title}
                              </h4>
                              <p className="text-muted-foreground text-xs">
                                {quiz.questions.length} questions
                              </p>
                            </div>
                            <ChevronRight className="text-muted-foreground h-4 w-4" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="flashcards" className="mt-4 space-y-4">
            {isLoadingFlashcards ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="text-muted-foreground size-8 animate-spin" />
              </div>
            ) : flashcards.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Zap />
                  </EmptyMedia>
                  <EmptyTitle>No Flashcards Yet</EmptyTitle>
                  <EmptyDescription>
                    Generate AI flashcards for spaced repetition learning
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    onClick={() => handleGenerateFlashcards(10)}
                    disabled={generateFlashcardsMutation.isPending}
                  >
                    {generateFlashcardsMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 size-4" />
                        Generate Flashcards
                      </>
                    )}
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <>
                {/* Flashcard Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3 text-center">
                    <div className="text-foreground text-lg font-bold">
                      {flashcards.length}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Total Cards
                    </div>
                  </Card>
                  <Card className="p-3 text-center">
                    <div className="text-primary text-lg font-bold">
                      {flashcards.reduce(
                        (sum, card) => sum + card.practiceCount,
                        0
                      )}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Total Reviews
                    </div>
                  </Card>
                </div>

                {/* Flashcard */}
                {currentCard && (
                  <Card
                    className="relative min-h-80 cursor-pointer p-6 transition-all hover:shadow-md"
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <Badge className="bg-primary text-primary-foreground absolute top-4 right-4">
                      Card {currentCardIndex + 1}/{flashcards.length}
                    </Badge>
                    <div className="flex h-full flex-col items-center justify-center pt-6 text-center">
                      <div className="bg-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                        <Zap className="text-primary h-7 w-7" />
                      </div>
                      {!isFlipped ? (
                        <>
                          <h3 className="text-foreground mb-4 px-2 text-base font-semibold">
                            {currentCard.front}
                          </h3>
                          <Badge variant="outline" className="mt-auto">
                            <RotateCcw className="mr-1.5 h-3 w-3" />
                            Tap to reveal answer
                          </Badge>
                        </>
                      ) : (
                        <>
                          <p className="text-muted-foreground mb-2 text-sm font-medium">
                            Answer
                          </p>
                          <p className="text-foreground/90 px-2 text-sm leading-relaxed text-pretty">
                            {currentCard.back}
                          </p>
                          <div className="text-muted-foreground mt-auto pt-4 text-xs">
                            Reviewed {currentCard.practiceCount}{" "}
                            {currentCard.practiceCount === 1 ? "time" : "times"}
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                )}

                {/* Flashcard Actions */}
                <div className="space-y-2">
                  {/* Navigation Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        if (currentCardIndex > 0) {
                          setCurrentCardIndex((prev) => prev - 1);
                          setIsFlipped(false);
                        }
                      }}
                      disabled={currentCardIndex === 0}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        if (currentCardIndex < flashcards.length - 1) {
                          setCurrentCardIndex((prev) => prev + 1);
                          setIsFlipped(false);
                        }
                      }}
                      disabled={currentCardIndex === flashcards.length - 1}
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  {/* Difficulty Buttons */}
                  {/* <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="gap-1.5 bg-transparent"
                      onClick={() => handleFlashcardAction("hard")}
                      disabled={
                        !isFlipped || practiceFlashcardMutation.isPending
                      }
                    >
                      <XCircle className="text-destructive h-4 w-4" />
                      <span className="text-xs">Hard</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-1.5 bg-transparent"
                      onClick={() => handleFlashcardAction("good")}
                      disabled={
                        !isFlipped || practiceFlashcardMutation.isPending
                      }
                    >
                      <RotateCcw className="text-warning h-4 w-4" />
                      <span className="text-xs">Good</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-1.5 bg-transparent"
                      onClick={() => handleFlashcardAction("easy")}
                      disabled={
                        !isFlipped || practiceFlashcardMutation.isPending
                      }
                    >
                      <CheckCircle2 className="text-success h-4 w-4" />
                      <span className="text-xs">Easy</span>
                    </Button>
                  </div> */}
                </div>

                {/* Generate More Button - Only show on last card */}
                {currentCardIndex === flashcards.length - 1 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleGenerateFlashcards(10)}
                    disabled={generateFlashcardsMutation.isPending}
                  >
                    {generateFlashcardsMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 size-4" />
                        Generate More Flashcards
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
