import { createContext } from "react";
import type { User, LoginFormData } from "../types/index";

export interface AuthContextType {
  user: User | null;
  login: (userData: LoginFormData) => void;
  logout: () => void;
  updateUserRole: (role: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
