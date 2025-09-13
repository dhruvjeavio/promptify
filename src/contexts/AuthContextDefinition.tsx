import { createContext } from "react";
import type { User, LoginFormData } from "../types/index";

export interface AuthContextType {
  user: User | null;
  login: (userData: LoginFormData) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
