import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  PromptRefinement,
} from "../types/index";

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

// Custom base query for mock data
const mockBaseQuery = async (
  arg: string | { url: string; method?: string; body?: unknown }
) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const url = typeof arg === "string" ? arg : arg.url;
  const method = typeof arg === "string" ? "GET" : arg.method || "GET";
  const body = typeof arg === "string" ? undefined : arg.body;

  // Handle GET requests
  if (method === "GET") {
    if (url === "/prompts") {
      return { data: mockPrompts };
    } else if (url === "/prompts/public") {
      return { data: mockPrompts.filter((prompt) => prompt.isPublic) };
    } else if (url === "/prompts/user") {
      return { data: mockPrompts.filter((prompt) => !prompt.isPublic) };
    } else if (
      url.startsWith("/prompts/") &&
      url !== "/prompts/public" &&
      url !== "/prompts/user"
    ) {
      const id = url.split("/")[2];
      const prompt = mockPrompts.find((p) => p.id === id);
      if (!prompt) {
        return { error: { status: 404, data: "Prompt not found" } };
      }
      return { data: prompt };
    }
  }

  // Handle POST requests (Create)
  if (method === "POST") {
    if (url === "/prompts") {
      const newId = (mockPrompts.length + 1).toString();
      const createdPrompt: Prompt = {
        ...(body as CreatePromptRequest),
        id: newId,
        author: "Current User",
        upvotes: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockPrompts.unshift(createdPrompt);
      return { data: createdPrompt };
    } else if (url.includes("/upvote")) {
      const id = url.split("/")[2];
      const prompt = mockPrompts.find((p) => p.id === id);
      if (!prompt) {
        return { error: { status: 404, data: "Prompt not found" } };
      }
      prompt.upvotes += 1;
      return { data: prompt };
    } else if (url.includes("/analyze")) {
      // Mock prompt analysis endpoint
      const promptText = (body as { promptText?: string })?.promptText || "";
      const overallScore = Math.floor(Math.random() * 4) + 6; // 6-10
      const clarity = Math.floor(Math.random() * 3) + 7; // 7-10
      const specificity = Math.floor(Math.random() * 4) + 5; // 5-9
      const effectiveness = Math.floor(Math.random() * 3) + 6; // 6-9

      const refinement: PromptRefinement = {
        originalPrompt: promptText,
        refinedPrompt: `${promptText}\n\nPlease provide a detailed response with specific examples and step-by-step instructions.`,
        score: {
          overallScore,
          clarity,
          specificity,
          effectiveness,
          suggestions: [
            "Consider adding more specific examples",
            "Break down complex instructions into smaller steps",
            "Include expected output format in the prompt",
            "Add context about the target audience",
          ],
        },
        improvements: [
          "Added explicit request for detailed response",
          "Included instruction for step-by-step format",
          "Enhanced specificity requirements",
        ],
      };
      return { data: refinement };
    }
  }

  // Handle PUT requests (Update)
  if (method === "PUT") {
    const id = url.split("/")[2];
    const index = mockPrompts.findIndex((p) => p.id === id);
    if (index === -1) {
      return { error: { status: 404, data: "Prompt not found" } };
    }
    mockPrompts[index] = {
      ...mockPrompts[index],
      ...(body as Partial<Prompt>),
      updatedAt: new Date().toISOString(),
    };
    return { data: mockPrompts[index] };
  }

  // Handle DELETE requests
  if (method === "DELETE") {
    const id = url.split("/")[2];
    const index = mockPrompts.findIndex((p) => p.id === id);
    if (index === -1) {
      return { error: { status: 404, data: "Prompt not found" } };
    }
    mockPrompts.splice(index, 1);
    return { data: undefined };
  }

  return { data: null };
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: mockBaseQuery,
  tagTypes: ["Prompt"],
  endpoints: (builder) => ({
    // Get all prompts
    getPrompts: builder.query<Prompt[], void>({
      query: () => "/prompts",
      providesTags: ["Prompt"],
    }),

    // Get public prompts only
    getPublicPrompts: builder.query<Prompt[], void>({
      query: () => "/prompts/public",
      providesTags: ["Prompt"],
    }),

    // Get user's private prompts
    getUserPrompts: builder.query<Prompt[], void>({
      query: () => "/prompts/user",
      providesTags: ["Prompt"],
    }),

    // Get single prompt by ID
    getPromptById: builder.query<Prompt, string>({
      query: (id) => `/prompts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Prompt", id }],
    }),

    // Create new prompt
    createPrompt: builder.mutation<Prompt, CreatePromptRequest>({
      query: (newPrompt) => ({
        url: "/prompts",
        method: "POST",
        body: newPrompt,
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

    // Analyze and refine a prompt
    analyzePrompt: builder.mutation<PromptRefinement, { promptText: string }>({
      query: (body) => ({
        url: "/prompts/analyze",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetPromptsQuery,
  useGetPublicPromptsQuery,
  useGetUserPromptsQuery,
  useGetPromptByIdQuery,
  useCreatePromptMutation,
  useUpdatePromptMutation,
  useDeletePromptMutation,
  useUpvotePromptMutation,
  useAnalyzePromptMutation,
} = apiSlice;
