import React, { useState, useEffect } from "react";
import type { User, LoginFormData } from "../types/index";
import { AuthContext } from "./AuthContextDefinition";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem("promptify_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("promptify_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: LoginFormData) => {
    const newUser: User = {
      id: Date.now().toString(), // Simple ID generation for demo
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("promptify_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("promptify_user");
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
