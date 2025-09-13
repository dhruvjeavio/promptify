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
  username?: string;
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
  targetAudience?: string;
  context: string;
  outputFormat: string;
  creativity: string;
  specificity: string;
  role: string;
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

export interface PromptAnalysisHistory {
  id: number;
  prompt_id: number;
  generated_text: string;
  created_at: string;
  analysis: {
    additional_suggestions: string[];
    clarity: number;
    effectiveness: number;
    improvements_made: string[];
    overall_score: number;
    refined_prompt: string;
    specificity: number;
  };
  usage_metadata: {
    candidates_token_count: number;
    prompt_token_count: number;
  };
}

export interface User {
  id: string;
  username: string;
  token: string;
  role?: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface LogoutResponse {
  message: string;
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
