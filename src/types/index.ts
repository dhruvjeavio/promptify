export interface Prompt {
  id: string;
  title: string;
  promptText: string;
  intendedUse: string;
  targetAudience: string;
  tags: string[];
  author: string;
  upvotes: number;
  rating: number; // 1-5
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePromptRequest {
  title: string;
  promptText: string;
  intendedUse: string;
  targetAudience: string;
  tags: string[];
  isPublic: boolean;
}

export interface UpdatePromptRequest extends Partial<CreatePromptRequest> {
  id: string;
}

export interface PromptFormData {
  goal: string;
  targetAudience: string;
  context: string;
  outputFormat: string;
  temperature: number;
  tone: string;
  maxLength: number;
  creativity: string;
  specificity: string;
}

export interface PromptScore {
  overallScore: number; // 1-10
  clarity: number; // 1-10
  specificity: number; // 1-10
  effectiveness: number; // 1-10
  suggestions: string[];
}

export interface PromptRefinement {
  originalPrompt: string;
  refinedPrompt: string;
  score: PromptScore;
  improvements: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginFormData {
  email: string;
  name: string;
  role: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
