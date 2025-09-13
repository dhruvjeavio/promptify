import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  PromptRefinement,
  PromptAnalysisHistory,
} from "../types/index";

// API response type
interface ApiPromptResponse {
  id: number;
  text: string;
  title: string;
  author: string;
  upvotes: number;
  intended_use: string;
  target_audience: string;
  tags: string;
  is_shared: boolean;
  expected_outcome?: string;
  username?: string;
  rating?: number;
  created_at?: string;
}

// Environment variables
const API_BASE_URL = import.meta.env.DEV
  ? "/api" // Use proxy in development
  : import.meta.env.VITE_API_BASE_URL || "http://172.23.17.86:8000";
const API_KEY = import.meta.env.VITE_API_KEY || "admin";

// Mock data for development
const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "Generate User Personas",
    promptText:
      "Based on the following user interview notes, create detailed user personas including demographics, goals, pain points, and behavioral patterns. Include specific quotes and insights from the interviews.",
    intendedUse: "UX Research",
    targetAudience: "Product Managers",
    tags: ["product", "ux", "research"],
    author: "Priya K.",
    upvotes: 15,
    rating: 4.5,
    isPublic: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Create Marketing Copy",
    promptText:
      "Act as a world-class copywriter. Create compelling marketing copy for [product/service] that targets [audience]. Focus on emotional triggers, clear value propositions, and strong calls-to-action.",
    intendedUse: "Marketing Campaign",
    targetAudience: "Potential Customers",
    tags: ["marketing", "copywriting"],
    author: "Amit S.",
    upvotes: 22,
    rating: 5,
    isPublic: true,
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    title: "Summarize Technical Document",
    promptText:
      "You are a helpful assistant. Summarize this technical document for a non-technical audience. Use simple language, avoid jargon, and highlight the key points and implications.",
    intendedUse: "Internal Comms",
    targetAudience: "Executives",
    tags: ["summary", "tech"],
    author: "Priya K.",
    upvotes: 8,
    rating: 4,
    isPublic: false,
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    title: "Code Review Assistant",
    promptText:
      "Review the following code for best practices, potential bugs, performance issues, and maintainability. Provide specific suggestions for improvement with examples.",
    intendedUse: "Code Quality",
    targetAudience: "Developers",
    tags: ["coding", "review", "best-practices"],
    author: "Raj M.",
    upvotes: 31,
    rating: 4.8,
    isPublic: true,
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "5",
    title: "Email Template Generator",
    promptText:
      "Create a professional email template for [purpose] that is appropriate for [context]. Include subject line suggestions and maintain a professional yet friendly tone.",
    intendedUse: "Business Communication",
    targetAudience: "Business Professionals",
    tags: ["email", "communication", "templates"],
    author: "Sarah L.",
    upvotes: 12,
    rating: 4.2,
    isPublic: true,
    createdAt: "2024-01-11T11:30:00Z",
    updatedAt: "2024-01-11T11:30:00Z",
  },
];

// Mock template data for sharing prompts
export const SHARING_PROMPT_TEMPLATES = [
  {
    id: "social-media-share",
    title: "Social Media Content Creator",
    description: "Create engaging social media posts to share your content",
    template: {
      goal: "Create engaging social media posts to share my [content type] and drive traffic to my [website/platform]",
      targetAudience: "Social media users interested in [your niche/topic]",
      context:
        "I want to promote my [specific content] and increase visibility",
      outputFormat: "Social media post with hashtags",
      tone: "Engaging and authentic",
      creativity: "High",
      specificity: "Platform-specific (Twitter, LinkedIn, Instagram, etc.)",
    },
  },
  {
    id: "link-promotion",
    title: "Link Promotion Specialist",
    description: "Generate compelling content to promote public links",
    template: {
      goal: "Create compelling promotional content for my public link to increase clicks and engagement",
      targetAudience: "Online community members and potential users",
      context:
        "I have a valuable resource/tool that I want to share with others",
      outputFormat: "Promotional text with call-to-action",
      tone: "Professional yet approachable",
      creativity: "Medium",
      specificity: "Clear value proposition",
    },
  },
  {
    id: "viral-content",
    title: "Viral Content Creator",
    description: "Design content that has the potential to go viral",
    template: {
      goal: "Create viral-worthy content to maximize reach and engagement for my [content type]",
      targetAudience: "General social media audience",
      context:
        "I want to create content that spreads organically and generates buzz",
      outputFormat: "Viral content strategy with multiple formats",
      tone: "Trendy and attention-grabbing",
      creativity: "Very High",
      specificity: "Platform-optimized for maximum reach",
    },
  },
  {
    id: "professional-sharing",
    title: "Professional Network Sharing",
    description:
      "Create professional content for LinkedIn and business networks",
    template: {
      goal: "Create professional content to share my work and insights with my professional network",
      targetAudience: "Professional colleagues and industry peers",
      context:
        "I want to establish thought leadership and share valuable insights",
      outputFormat: "Professional post with industry insights",
      tone: "Professional and authoritative",
      creativity: "Medium",
      specificity: "Industry-specific and data-driven",
    },
  },
];

// Mock roles data
export const ROLES = [
  "Product Manager",
  "Project Manager",
  "Scrum Master",
  "Agile Coach",
  "UX/UI Designer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Cybersecurity Engineer",
  "Network Engineer",
  "System Administrator",
  "Database Administrator",
  "Software Engineer",
  "QA Engineer",
  "Technical Writer",
  "Technical Support",
  "IT Manager",
  "IT Director",
  "IT Consultant",
  "IT Architect",
  "IT Security Analyst",
  "Other",
];

// Real API base query
const realApiQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  timeout: 100000, // Increased timeout for ngrok
  prepareHeaders: (headers) => {
    headers.set("X-Authorization", API_KEY);
    headers.set("Content-Type", "application/json");
    headers.set("ngrok-skip-browser-warning", "true"); // Skip ngrok browser warning

    // Add authentication token if available
    const token = localStorage.getItem("promptify_token");
    if (token) {
      headers.set("x-access-token", token);
    }

    return headers;
  },
});

// Use real API base query
const baseQuery = realApiQuery;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQuery,
  tagTypes: ["Prompt", "PromptHistory"],
  endpoints: (builder) => ({
    // Get all prompts with optional filtering
    getPrompts: builder.query<
      Prompt[],
      { filter?: "all" | "public" | "private" } | void
    >({
      query: () => "/prompts",
      transformResponse: (response: ApiPromptResponse[], _meta, arg) => {
        const prompts = response.map((item: ApiPromptResponse) => ({
          id: item.id.toString(),
          title: item.title || "Untitled Prompt",
          promptText: item.text || "",
          intendedUse: item.intended_use || "",
          targetAudience: item.target_audience || "",
          tags: item.tags
            ? item.tags.split(", ").filter((tag: string) => tag.trim())
            : [],
          author: item.author || "Unknown",
          upvotes: 0,
          rating: 4.0,
          isPublic: item.is_shared || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          username: item.username || "",
        }));

        // Apply filtering based on is_shared
        if (arg?.filter === "public") {
          return prompts.filter((prompt) => prompt.isPublic);
        } else if (arg?.filter === "private") {
          return prompts.filter((prompt) => !prompt.isPublic);
        }

        return prompts;
      },
      providesTags: ["Prompt"],
    }),

    // Get user's private prompts
    getUserPrompts: builder.query<Prompt[], void>({
      query: () => "/prompts/user",
      transformResponse: (response: ApiPromptResponse[]) =>
        response.map((item: ApiPromptResponse) => ({
          id: item.id.toString(),
          title: item.title || "Untitled Prompt",
          promptText: item.text || "",
          intendedUse: item.intended_use || "",
          targetAudience: item.target_audience || "",
          tags: item.tags
            ? item.tags.split(", ").filter((tag: string) => tag.trim())
            : [],
          author: item.author || "Unknown",
          upvotes: 0,
          rating: item.upvotes,
          isPublic: item.is_shared || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          username: item.username || "",
        })),
      providesTags: ["Prompt"],
    }),

    // Create new prompt
    createPrompt: builder.mutation<Prompt, CreatePromptRequest>({
      query: (newPrompt) => ({
        url: "/prompts",
        method: "POST",
        body: {
          text: newPrompt.promptText,
          title: newPrompt.title,
          intended_use: newPrompt.intendedUse,
          target_audience: newPrompt.targetAudience,
          // expected_outcome: newPrompt.expectedOutcome,
          tags: newPrompt.tags.join(", "),
          is_public: newPrompt.isPublic,
        },
      }),
      transformResponse: (response: ApiPromptResponse) => ({
        id: response.id.toString(),
        title: response.title || "Untitled Prompt",
        promptText: response.text || "",
        intendedUse: response.intended_use || "",
        targetAudience: response.target_audience || "",
        tags: response.tags
          ? response.tags.split(", ").filter((tag: string) => tag.trim())
          : [],
        author: response.author || "Unknown",
        upvotes: response.upvotes,
        rating: response.rating,
        isPublic: response.is_shared || false,
        createdAt: response.created_at,
        updatedAt: response.created_at || "",
        username: response.username || "",
      }),
      invalidatesTags: ["Prompt"],
    }),

    // Update existing prompt
    updatePrompt: builder.mutation<Prompt, UpdatePromptRequest>({
      query: ({ id, ...updates }) => ({
        url: `/prompts/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Prompt", id }],
    }),

    // Delete prompt
    deletePrompt: builder.mutation<void, string>({
      query: (id) => ({
        url: `/prompts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prompt"],
    }),

    // Upvote a prompt
    upvotePrompt: builder.mutation<Prompt, string>({
      query: (id) => ({
        url: `/prompts/${id}/upvote`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Prompt", id }],
    }),

    // Publish a prompt (make it public)
    publishPrompt: builder.mutation<ApiPromptResponse, string>({
      query: (id) => ({
        url: `/prompts/${id}/publish`,
        method: "PUT",
      }),
      transformResponse: (response: ApiPromptResponse) => response,
      invalidatesTags: (_result, _error, id) => [{ type: "Prompt", id }],
    }),

    // Analyze and refine a prompt
    analyzePrompt: builder.mutation<PromptRefinement, string>({
      query: (promptId) => {
        return {
          url: `/prompts/${promptId}/generate`,
          method: "POST",
        };
      },
      transformResponse: (response: PromptAnalysisHistory) => {
        return {
          originalPrompt: response.generated_text,
          refinedPrompt: response.analysis.refined_prompt,
          score: {
            overallScore: response.analysis.overall_score,
            clarity: response.analysis.clarity,
            specificity: response.analysis.specificity,
            effectiveness: response.analysis.effectiveness,
            suggestions: response.analysis.additional_suggestions,
          },
          improvements: response.analysis.improvements_made,
        };
      },
    }),

    // Get sharing prompt templates
    getSharingTemplates: builder.query<unknown, void>({
      query: () => "/templates/sharing",
    }),

    // Get available roles
    getRoles: builder.query<string[], void>({
      query: () => "/roles",
      transformResponse: () => ROLES,
    }),

    // Get prompt history
    getPromptHistory: builder.query<PromptAnalysisHistory[], string>({
      query: (promptId) => `/prompts/${promptId}/history`,
      transformResponse: (response: PromptAnalysisHistory[]) => response,
      providesTags: (_result, _error, promptId) => [
        { type: "Prompt", id: promptId },
        { type: "PromptHistory", id: promptId },
      ],
    }),

    // Logout user
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetPromptsQuery,
  useGetUserPromptsQuery,
  useCreatePromptMutation,
  useUpdatePromptMutation,
  useDeletePromptMutation,
  useUpvotePromptMutation,
  usePublishPromptMutation,
  useAnalyzePromptMutation,
  useGetSharingTemplatesQuery,
  useGetRolesQuery,
  useGetPromptHistoryQuery,
  useLogoutMutation,
} = apiSlice;
