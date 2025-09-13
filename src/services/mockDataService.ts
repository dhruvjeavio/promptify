import type { Prompt, PromptFormData } from "../types/index";

// Template categories for better organization
export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: PromptTemplate[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  formData: PromptFormData;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  useCases: string[];
}

// Comprehensive template categories
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "business",
    name: "Business & Strategy",
    description: "Templates for business planning, strategy, and operations",
    icon: "💼",
    templates: [
      {
        id: "business-plan",
        title: "Business Plan Generator",
        description:
          "Create comprehensive business plans with market analysis and financial projections",
        category: "business",
        formData: {
          goal: "Generate a comprehensive business plan for [business idea] including executive summary, market analysis, financial projections, and growth strategy",
          targetAudience: "Entrepreneurs and business owners",
          context:
            "I'm starting a new business and need a structured plan to present to investors and stakeholders",
          outputFormat: "Structured business plan document",
          creativity: "Balanced",
          specificity: "Comprehensive & Detailed",
          role: "Business Consultant",
        },
        tags: ["business", "planning", "strategy", "finance"],
        difficulty: "Advanced",
        estimatedTime: "30-45 minutes",
        useCases: [
          "Startup planning",
          "Investor presentations",
          "Strategic planning",
        ],
      },
      {
        id: "swot-analysis",
        title: "SWOT Analysis",
        description: "Conduct thorough SWOT analysis for business decisions",
        category: "business",
        formData: {
          goal: "Perform a comprehensive SWOT analysis for [company/product/service] to identify strengths, weaknesses, opportunities, and threats",
          targetAudience: "Business analysts and managers",
          context:
            "I need to evaluate my business position and identify strategic opportunities",
          outputFormat: "Structured SWOT matrix with actionable insights",
          creativity: "Factual & Precise",
          specificity: "Comprehensive & Detailed",
          role: "Business Analyst",
        },
        tags: ["analysis", "strategy", "business", "planning"],
        difficulty: "Intermediate",
        estimatedTime: "20-30 minutes",
        useCases: [
          "Strategic planning",
          "Competitive analysis",
          "Decision making",
        ],
      },
      {
        id: "market-research",
        title: "Market Research Report",
        description:
          "Generate detailed market research and competitive analysis",
        category: "business",
        formData: {
          goal: "Create a comprehensive market research report for [industry/product] including market size, trends, competitors, and opportunities",
          targetAudience: "Product managers and marketing teams",
          context:
            "I need to understand the market landscape before launching a new product or service",
          outputFormat: "Detailed market research report",
          creativity: "Balanced",
          specificity: "Comprehensive & Detailed",
          role: "Market Research Analyst",
        },
        tags: ["research", "market", "analysis", "competitive"],
        difficulty: "Advanced",
        estimatedTime: "45-60 minutes",
        useCases: ["Product launch", "Market entry", "Competitive analysis"],
      },
    ],
  },
  {
    id: "technical",
    name: "Technical & Development",
    description:
      "Templates for software development, technical documentation, and engineering",
    icon: "💻",
    templates: [
      {
        id: "code-review",
        title: "Code Review Assistant",
        description:
          "Comprehensive code review with best practices and improvements",
        category: "technical",
        formData: {
          goal: "Review the following code for best practices, potential bugs, performance issues, and maintainability. Provide specific suggestions for improvement with examples",
          targetAudience: "Software developers and engineering teams",
          context:
            "I need to ensure code quality and maintainability for my development team",
          outputFormat: "Structured code review with recommendations",
          creativity: "Factual & Precise",
          specificity: "Comprehensive & Detailed",
          role: "Senior Software Engineer",
        },
        tags: ["coding", "review", "best-practices", "quality"],
        difficulty: "Intermediate",
        estimatedTime: "15-25 minutes",
        useCases: ["Code quality", "Team reviews", "Learning"],
      },
      {
        id: "api-documentation",
        title: "API Documentation Generator",
        description: "Create comprehensive API documentation with examples",
        category: "technical",
        formData: {
          goal: "Generate comprehensive API documentation for [API/service] including endpoints, parameters, response formats, and usage examples",
          targetAudience: "Developers and API consumers",
          context:
            "I need to document my API for other developers to use effectively",
          outputFormat: "Structured API documentation",
          creativity: "Factual & Precise",
          specificity: "Comprehensive & Detailed",
          role: "Technical Writer",
        },
        tags: ["api", "documentation", "technical", "developer"],
        difficulty: "Intermediate",
        estimatedTime: "25-35 minutes",
        useCases: ["API development", "Developer onboarding", "Documentation"],
      },
      {
        id: "system-design",
        title: "System Design Architect",
        description:
          "Design scalable system architectures and technical solutions",
        category: "technical",
        formData: {
          goal: "Design a scalable system architecture for [application/service] including database design, microservices, caching, and deployment strategy",
          targetAudience: "Software architects and senior engineers",
          context:
            "I need to design a robust, scalable system that can handle growth and high traffic",
          outputFormat:
            "System architecture diagram and detailed specifications",
          creativity: "Creative & Suggestive",
          specificity: "Comprehensive & Detailed",
          role: "Solutions Architect",
        },
        tags: ["architecture", "system-design", "scalability", "engineering"],
        difficulty: "Advanced",
        estimatedTime: "40-60 minutes",
        useCases: [
          "System planning",
          "Technical interviews",
          "Architecture decisions",
        ],
      },
    ],
  },
  {
    id: "creative",
    name: "Creative & Content",
    description:
      "Templates for creative writing, content creation, and artistic projects",
    icon: "🎨",
    templates: [
      {
        id: "blog-post",
        title: "Blog Post Creator",
        description: "Generate engaging blog posts with SEO optimization",
        category: "creative",
        formData: {
          goal: "Create an engaging blog post about [topic] that is SEO-optimized, includes relevant keywords, and provides value to readers",
          targetAudience: "Blog readers and content consumers",
          context:
            "I need to create regular content for my blog to drive traffic and engagement",
          outputFormat:
            "Complete blog post with title, introduction, body, and conclusion",
          creativity: "Creative & Suggestive",
          specificity: "Comprehensive & Detailed",
          role: "Content Writer",
        },
        tags: ["writing", "blog", "content", "seo"],
        difficulty: "Intermediate",
        estimatedTime: "30-45 minutes",
        useCases: ["Content marketing", "Blog writing", "SEO content"],
      },
      {
        id: "story-writer",
        title: "Creative Story Writer",
        description: "Craft compelling stories and narratives",
        category: "creative",
        formData: {
          goal: "Write a compelling [story type] about [theme/topic] with well-developed characters, engaging plot, and satisfying conclusion",
          targetAudience: "General readers and story enthusiasts",
          context:
            "I want to create engaging stories for entertainment or educational purposes",
          outputFormat:
            "Complete story with character development and plot structure",
          creativity: "Creative & Suggestive",
          specificity: "Comprehensive & Detailed",
          role: "Creative Writer",
        },
        tags: ["writing", "story", "creative", "narrative"],
        difficulty: "Advanced",
        estimatedTime: "45-60 minutes",
        useCases: ["Creative writing", "Entertainment", "Educational content"],
      },
      {
        id: "social-media",
        title: "Social Media Content Creator",
        description: "Create engaging social media posts and campaigns",
        category: "creative",
        formData: {
          goal: "Create engaging social media content for [platform] about [topic] that drives engagement, includes relevant hashtags, and encourages interaction",
          targetAudience: "Social media users and followers",
          context:
            "I need to maintain an active social media presence and grow my audience",
          outputFormat: "Social media post with hashtags and engagement hooks",
          creativity: "Creative & Suggestive",
          specificity: "Platform-specific (Twitter, LinkedIn, Instagram, etc.)",
          role: "Social Media Manager",
        },
        tags: ["social-media", "content", "marketing", "engagement"],
        difficulty: "Beginner",
        estimatedTime: "15-25 minutes",
        useCases: [
          "Social media marketing",
          "Brand building",
          "Community engagement",
        ],
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing & Sales",
    description:
      "Templates for marketing campaigns, sales strategies, and customer engagement",
    icon: "📈",
    templates: [
      {
        id: "email-campaign",
        title: "Email Marketing Campaign",
        description: "Create effective email marketing campaigns and sequences",
        category: "marketing",
        formData: {
          goal: "Design a complete email marketing campaign for [product/service] including welcome series, promotional emails, and nurture sequences",
          targetAudience: "Email subscribers and potential customers",
          context:
            "I need to build an email marketing strategy to nurture leads and drive conversions",
          outputFormat:
            "Complete email campaign with subject lines and content",
          creativity: "Creative & Suggestive",
          specificity: "Comprehensive & Detailed",
          role: "Email Marketing Specialist",
        },
        tags: ["email", "marketing", "campaign", "conversion"],
        difficulty: "Intermediate",
        estimatedTime: "35-45 minutes",
        useCases: ["Lead nurturing", "Customer retention", "Sales conversion"],
      },
      {
        id: "sales-pitch",
        title: "Sales Pitch Generator",
        description: "Craft compelling sales pitches and presentations",
        category: "marketing",
        formData: {
          goal: "Create a compelling sales pitch for [product/service] that addresses customer pain points, highlights unique value propositions, and includes a strong call-to-action",
          targetAudience: "Potential customers and decision makers",
          context:
            "I need to present my product/service to prospects and close more deals",
          outputFormat: "Structured sales pitch with key talking points",
          creativity: "Creative & Suggestive",
          specificity: "Comprehensive & Detailed",
          role: "Sales Representative",
        },
        tags: ["sales", "pitch", "presentation", "conversion"],
        difficulty: "Intermediate",
        estimatedTime: "25-35 minutes",
        useCases: ["Sales presentations", "Client meetings", "Pitch decks"],
      },
      {
        id: "customer-persona",
        title: "Customer Persona Builder",
        description:
          "Develop detailed customer personas for targeted marketing",
        category: "marketing",
        formData: {
          goal: "Create detailed customer personas for [product/service] including demographics, psychographics, pain points, and buying behavior",
          targetAudience: "Marketing teams and product managers",
          context:
            "I need to better understand my target customers to create more effective marketing campaigns",
          outputFormat: "Detailed customer persona profiles with insights",
          creativity: "Balanced",
          specificity: "Comprehensive & Detailed",
          role: "Marketing Manager",
        },
        tags: ["personas", "marketing", "research", "targeting"],
        difficulty: "Intermediate",
        estimatedTime: "30-40 minutes",
        useCases: [
          "Marketing strategy",
          "Product development",
          "Customer research",
        ],
      },
    ],
  },
  {
    id: "education",
    name: "Education & Training",
    description:
      "Templates for educational content, training materials, and learning resources",
    icon: "📚",
    templates: [
      {
        id: "lesson-plan",
        title: "Lesson Plan Creator",
        description:
          "Design comprehensive lesson plans and educational content",
        category: "education",
        formData: {
          goal: "Create a detailed lesson plan for [subject/topic] including learning objectives, activities, assessments, and materials needed",
          targetAudience: "Students and learners",
          context:
            "I need to create structured educational content that effectively teaches the subject matter",
          outputFormat: "Complete lesson plan with activities and assessments",
          creativity: "Balanced",
          specificity: "Comprehensive & Detailed",
          role: "Educator",
        },
        tags: ["education", "lesson-plan", "teaching", "learning"],
        difficulty: "Intermediate",
        estimatedTime: "30-40 minutes",
        useCases: ["Teaching", "Training", "Educational content"],
      },
      {
        id: "study-guide",
        title: "Study Guide Generator",
        description: "Create comprehensive study guides and learning materials",
        category: "education",
        formData: {
          goal: "Generate a comprehensive study guide for [subject/exam] including key concepts, practice questions, and study strategies",
          targetAudience: "Students preparing for exams or learning new topics",
          context:
            "I need to create effective study materials that help with learning and retention",
          outputFormat: "Structured study guide with practice materials",
          creativity: "Balanced",
          specificity: "Comprehensive & Detailed",
          role: "Academic Tutor",
        },
        tags: ["study", "education", "learning", "exam-prep"],
        difficulty: "Intermediate",
        estimatedTime: "35-45 minutes",
        useCases: ["Exam preparation", "Self-study", "Academic support"],
      },
      {
        id: "training-manual",
        title: "Training Manual Creator",
        description: "Develop comprehensive training manuals and documentation",
        category: "education",
        formData: {
          goal: "Create a comprehensive training manual for [process/system] including step-by-step instructions, troubleshooting, and best practices",
          targetAudience: "Employees and team members",
          context:
            "I need to create training materials that help new team members learn processes effectively",
          outputFormat:
            "Complete training manual with instructions and examples",
          creativity: "Factual & Precise",
          specificity: "Comprehensive & Detailed",
          role: "Training Specialist",
        },
        tags: ["training", "manual", "documentation", "onboarding"],
        difficulty: "Advanced",
        estimatedTime: "45-60 minutes",
        useCases: ["Employee training", "Process documentation", "Onboarding"],
      },
    ],
  },
  {
    id: "productivity",
    name: "Productivity & Organization",
    description:
      "Templates for productivity, project management, and personal organization",
    icon: "⚡",
    templates: [
      {
        id: "project-plan",
        title: "Project Planning Template",
        description:
          "Create detailed project plans with timelines and milestones",
        category: "productivity",
        formData: {
          goal: "Create a comprehensive project plan for [project] including timeline, milestones, deliverables, resources, and risk management",
          targetAudience: "Project managers and team members",
          context:
            "I need to organize and track a complex project with multiple stakeholders and deadlines",
          outputFormat:
            "Detailed project plan with Gantt chart and task breakdown",
          creativity: "Balanced",
          specificity: "Comprehensive & Detailed",
          role: "Project Manager",
        },
        tags: ["project-management", "planning", "organization", "timeline"],
        difficulty: "Intermediate",
        estimatedTime: "35-45 minutes",
        useCases: [
          "Project planning",
          "Team coordination",
          "Deadline management",
        ],
      },
      {
        id: "meeting-agenda",
        title: "Meeting Agenda Creator",
        description: "Design effective meeting agendas and facilitation guides",
        category: "productivity",
        formData: {
          goal: "Create a structured meeting agenda for [meeting type] including objectives, topics, time allocation, and action items",
          targetAudience: "Meeting participants and facilitators",
          context:
            "I need to run productive meetings that achieve specific objectives and engage all participants",
          outputFormat: "Complete meeting agenda with facilitation notes",
          creativity: "Balanced",
          specificity: "Moderately Detailed",
          role: "Meeting Facilitator",
        },
        tags: ["meetings", "agenda", "facilitation", "productivity"],
        difficulty: "Beginner",
        estimatedTime: "15-25 minutes",
        useCases: ["Team meetings", "Client meetings", "Workshops"],
      },
      {
        id: "personal-goals",
        title: "Personal Goal Setting",
        description:
          "Create structured personal development and goal-setting plans",
        category: "productivity",
        formData: {
          goal: "Create a comprehensive personal development plan for [goal area] including SMART goals, action steps, timeline, and progress tracking methods",
          targetAudience: "Individuals seeking personal growth",
          context:
            "I want to set and achieve meaningful personal goals with a structured approach",
          outputFormat: "Personal development plan with tracking system",
          creativity: "Creative & Suggestive",
          specificity: "Comprehensive & Detailed",
          role: "Life Coach",
        },
        tags: ["goals", "personal-development", "planning", "growth"],
        difficulty: "Intermediate",
        estimatedTime: "30-40 minutes",
        useCases: ["Personal growth", "Goal achievement", "Self-improvement"],
      },
    ],
  },
];

// Get templates by category
export const getTemplatesByCategory = (
  categoryId: string
): PromptTemplate[] => {
  const category = TEMPLATE_CATEGORIES.find((cat) => cat.id === categoryId);
  return category ? category.templates : [];
};

// Get all templates
export const getAllTemplates = (): PromptTemplate[] => {
  return TEMPLATE_CATEGORIES.flatMap((category) => category.templates);
};

// Get template by ID
export const getTemplateById = (
  templateId: string
): PromptTemplate | undefined => {
  return getAllTemplates().find((template) => template.id === templateId);
};

// Get templates by difficulty
export const getTemplatesByDifficulty = (
  difficulty: "Beginner" | "Intermediate" | "Advanced"
): PromptTemplate[] => {
  return getAllTemplates().filter(
    (template) => template.difficulty === difficulty
  );
};

// Get templates by role
export const getTemplatesByRole = (role: string): PromptTemplate[] => {
  return getAllTemplates().filter(
    (template) =>
      template.formData.role.toLowerCase().includes(role.toLowerCase()) ||
      role.toLowerCase().includes(template.formData.role.toLowerCase())
  );
};

// Search templates
export const searchTemplates = (query: string): PromptTemplate[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllTemplates().filter(
    (template) =>
      template.title.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      template.useCases.some((useCase) =>
        useCase.toLowerCase().includes(lowercaseQuery)
      )
  );
};

// Get recommended templates based on user role and context
export const getRecommendedTemplates = (
  userRole?: string
): PromptTemplate[] => {
  let templates = getAllTemplates();

  // Filter by role if provided
  if (userRole) {
    templates = getTemplatesByRole(userRole);
  }

  // If no role-specific templates found, return all templates
  if (templates.length === 0) {
    templates = getAllTemplates();
  }

  // Sort by relevance (you can add more sophisticated ranking logic here)
  return templates.slice(0, 6); // Return top 6 recommendations
};

// Mock prompts for demonstration
export const MOCK_PROMPTS: Prompt[] = [
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

// Export all template categories for easy access
