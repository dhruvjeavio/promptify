import { createContext } from "react";
import type { PaletteMode } from "@mui/material";

export interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
