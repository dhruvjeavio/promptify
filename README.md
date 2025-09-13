# Promptify

A modern, team-focused AI prompt management platform built with React, TypeScript, and Material-UI. Promptify helps teams discover, create, and share effective AI prompts for various use cases.

## 🚀 Features

- **Bookshelf**: Browse and discover prompts created by your team members
- **Guided Prompt Builder**: Create effective AI prompts using our guided form with templates
- **Sharing Templates**: Pre-built templates for social media and content sharing prompts
- **Advanced Search & Filtering**: Find prompts by keywords, tags, and various sorting options
- **Prompt Management**: Save, organize, and manage your personal prompt library
- **Rating & Upvoting**: Community-driven prompt quality assessment
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Authentication**: Secure user authentication and role-based access

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Framework**: Material-UI (MUI) v7
- **State Management**: Redux Toolkit with RTK Query
- **Routing**: React Router DOM v7
- **Styling**: Emotion, Tailwind CSS v4
- **Form Handling**: React Hook Form with Yup validation
- **Build Tool**: Vite with TypeScript support
- **Linting**: ESLint with TypeScript rules

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd promptify
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

4. **Update environment variables in `.env`**:

   ```env
   VITE_API_BASE_URL=<YOUR BACKEND URL>
   VITE_API_KEY=<YOUR BACKEND API KEY>
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.tsx       # Custom button component
│   ├── Card.tsx         # Card layout component
│   ├── Footer.tsx       # Application footer
│   ├── GuidedBuilderForm.tsx  # Prompt creation form
│   ├── Loader.tsx       # Loading spinner component
│   ├── Modal.tsx        # Modal dialog component
│   ├── Navbar.tsx       # Navigation bar
│   ├── PromptCard.tsx   # Prompt display card
│   ├── PromptRunner.tsx # Prompt execution component
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   ├── SharePrompt.tsx  # Prompt sharing functionality
│   └── SharingPromptTemplates.tsx # Sharing templates
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication context
│   └── useAuth.ts       # Authentication hook
├── hooks/               # Custom React hooks
│   └── usePrompts.ts    # Prompt-related hooks
├── pages/               # Application pages
│   ├── DashboardPage.tsx    # Main dashboard
│   ├── LoginPage.tsx        # User login
│   ├── MyLibraryPage.tsx    # Personal prompt library
│   ├── PromptBuilderPage.tsx # Prompt creation
│   └── PromptDetailPage.tsx # Individual prompt view
├── services/            # API services
│   └── apiSlice.ts      # RTK Query API slice
├── store/               # Redux store configuration
│   └── index.ts         # Store setup
├── theme/               # Theme configuration
│   ├── index.tsx        # Theme provider
│   └── ThemeContext.tsx # Theme context
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types
└── constants/           # Application constants
    └── constants.tsx    # App-wide constants
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Development

### Key Features Implementation

1. **Authentication System**
   - Context-based authentication
   - Protected routes
   - Role-based access control

2. **Prompt Management**
   - CRUD operations for prompts
   - Search and filtering
   - Tag-based organization
   - Rating and upvoting system

3. **Guided Prompt Builder**
   - Step-by-step form wizard
   - Template-based creation
   - Form validation with Yup
   - Real-time prompt generation

4. **State Management**
   - Redux Toolkit for global state
   - RTK Query for API calls
   - Optimistic updates
   - Caching and invalidation

## 🌐 API Integration

The application uses RTK Query for API communication with the following endpoints:

- `GET /prompts` - Fetch public prompts
- `POST /prompts` - Create new prompt
- `PUT /prompts/:id` - Update prompt
- `DELETE /prompts/:id` - Delete prompt
- `POST /prompts/:id/upvote` - Upvote prompt

## 🎨 Theming

The application uses Material-UI theming with:

- Custom theme configuration
- Dark/light mode support
- Responsive design
- Consistent color palette
- Typography system

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🎯 Usage Guide

### Getting Started

1. **Login**: Start by logging in with your credentials
2. **Browse Prompts**: Explore the team library to discover existing prompts
3. **Create Prompts**: Use the guided builder to create new prompts
4. **Manage Library**: Organize your personal prompt collection

### Creating a Prompt

1. Navigate to the **Builder** page
2. Choose between **Sharing Templates** or **Custom Prompt**
3. Fill out the guided form with:
   - Goal and objective
   - Target audience
   - Context and requirements
   - Output format preferences
4. Add relevant tags for better discoverability
5. Submit to create your prompt

### Searching and Filtering

- Use the search bar to find prompts by keywords
- Filter by tags using the tag selector
- Sort by newest, oldest, rating, or upvotes
- Clear filters to reset your view

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI for the excellent component library
- Redux Toolkit for state management
- React Hook Form for form handling
- The open-source community for inspiration and tools
