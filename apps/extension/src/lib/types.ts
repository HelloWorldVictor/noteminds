// Types for the application based on backend schema

export interface Summary {
  id: string;
  title: string;
  createdBy: string;
  webpageId: string;
  content: string;
  type: "brief" | "detailed" | "bullet_points";
  wordCount: number;
  metadata?: {
    model?: string;
    processingTime?: number;
    confidence?: number;
  };
  createdAt: number;
}

export interface Webpage {
  id: string;
  url: string;
  title: string;
  extractedContent: string;
  createdBy: string;
  createdAt: number;
  metadata?: {
    description?: string;
    author?: string;
    publishedDate?: string;
    readingTime?: number;
  };
}

export interface Quiz {
  id: string;
  userId: string;
  webpageId: string;
  title: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  metadata?: {
    model?: string;
    processingTime?: number;
    difficulty?: "easy" | "medium" | "hard";
  };
  createdAt: number;
}

export interface Flashcard {
  id: string;
  userId: string;
  webpageId: string;
  front: string;
  back: string;
  practiceCount: number;
  createdAt: number;
}

export interface UserNote {
  id: string;
  userId: string;
  webpageId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
