import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { Box } from "@mui/material";
import { store } from "./store";
import { CustomThemeProvider } from "./theme";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/useAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import MyLibraryPage from "./pages/MyLibraryPage";
import PromptBuilderPage from "./pages/PromptBuilderPage";
import PromptDetailPage from "./pages/PromptDetailPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import type { LoginFormData } from "./types/index";

const AppContent: React.FC = () => {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (userData: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login(userData);
      // Redirect to dashboard after successful login
      navigate("/");
    } catch {
      setLoginError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if current route is login page
  const isLoginPage = location.pathname === "/login";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100vw",
        padding: 0,
        margin: 0,
        overflowX: "hidden",
      }}
    >
      {!isLoginPage && <Navbar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Routes>
          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={handleLogin}
                error={loginError || undefined}
                loading={isLoading}
              />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-library"
            element={
              <ProtectedRoute>
                <MyLibraryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/builder"
            element={
              <ProtectedRoute>
                <PromptBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prompts/:id"
            element={
              <ProtectedRoute>
                <PromptDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>

      {!isLoginPage && <Footer />}
    </Box>
  );
};

function App() {
  return (
    <Provider store={store}>
      <CustomThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </CustomThemeProvider>
    </Provider>
  );
}

export default App;
