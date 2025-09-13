import React, { useState, useEffect } from "react";
import type { User, LoginFormData, LoginResponse } from "../types/index";
import { AuthContext } from "./AuthContextDefinition";
import { useLogoutMutation } from "../services/apiSlice";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem("promptify_user");
    const storedToken = localStorage.getItem("promptify_token");

    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({ ...userData, token: storedToken });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("promptify_user");
        localStorage.removeItem("promptify_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginFormData): Promise<LoginResponse> => {
    try {
      // Make API call to login endpoint
      const response = await fetch(
        "https://f36779abb590.ngrok-free.app/login",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data: LoginResponse = await response.json();

      const newUser: User = {
        id: credentials.username, // Use username as ID
        username: credentials.username,
        token: data.token,
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("promptify_user", JSON.stringify(newUser));
      localStorage.setItem("promptify_token", data.token);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const updateUserRole = (role: string) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("promptify_user", JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    try {
      // Use RTK Query logout mutation
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("promptify_user");
      localStorage.removeItem("promptify_token");
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUserRole,
    isAuthenticated,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
