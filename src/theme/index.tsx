import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { ThemeContext } from "./ThemeContext";

interface CustomThemeProviderProps {
  children: React.ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
}) => {
  const [mode, setMode] = useState<PaletteMode>("dark");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#1976d2" : "#90caf9",
            light: mode === "light" ? "#42a5f5" : "#bbdefb",
            dark: mode === "light" ? "#1565c0" : "#5c6bc0",
          },
          secondary: {
            main: mode === "light" ? "#dc004e" : "#f48fb1",
            light: mode === "light" ? "#ff5983" : "#ffb3d1",
            dark: mode === "light" ? "#9a0036" : "#c2185b",
          },
          background: {
            default: mode === "light" ? "#fafafa" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
          text: {
            primary: mode === "light" ? "#212121" : "#ffffff",
            secondary: mode === "light" ? "#757575" : "#b0b0b0",
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: "3.5rem",
            fontWeight: 700,
            lineHeight: 1.2,
          },
          h2: {
            fontSize: "2.75rem",
            fontWeight: 600,
            lineHeight: 1.3,
          },
          h3: {
            fontSize: "2.25rem",
            fontWeight: 600,
            lineHeight: 1.3,
          },
          h4: {
            fontSize: "1.875rem",
            fontWeight: 600,
            lineHeight: 1.4,
          },
          h5: {
            fontSize: "1.5rem",
            fontWeight: 500,
            lineHeight: 1.4,
          },
          h6: {
            fontSize: "1.25rem",
            fontWeight: 500,
            lineHeight: 1.4,
          },
          body1: {
            fontSize: "1.125rem",
            lineHeight: 1.6,
          },
          body2: {
            fontSize: "1rem",
            lineHeight: 1.5,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow:
                  mode === "light"
                    ? "0 2px 8px rgba(0,0,0,0.1)"
                    : "0 2px 8px rgba(255,255,255,0.1)",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow:
                  mode === "light"
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : "0 2px 4px rgba(255,255,255,0.1)",
              },
            },
          },
        },
      }),
    [mode]
  );

  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
