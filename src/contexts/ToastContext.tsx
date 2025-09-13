import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import type { SlideProps } from "@mui/material/Slide";

export type ToastSeverity = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  severity: ToastSeverity;
  duration?: number;
  action?: React.ReactNode;
}

interface ToastContextType {
  showToast: (
    message: string,
    severity?: ToastSeverity,
    duration?: number,
    action?: React.ReactNode
  ) => void;
  showSuccess: (
    message: string,
    duration?: number,
    action?: React.ReactNode
  ) => void;
  showError: (
    message: string,
    duration?: number,
    action?: React.ReactNode
  ) => void;
  showWarning: (
    message: string,
    duration?: number,
    action?: React.ReactNode
  ) => void;
  showInfo: (
    message: string,
    duration?: number,
    action?: React.ReactNode
  ) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

// Slide transition component for better animations
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      severity: ToastSeverity = "info",
      duration: number = 4000,
      action?: React.ReactNode
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
        id,
        message,
        severity,
        duration,
        action,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-hide after duration
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, duration?: number, action?: React.ReactNode) => {
      showToast(message, "success", duration, action);
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, duration?: number, action?: React.ReactNode) => {
      showToast(message, "error", duration, action);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, duration?: number, action?: React.ReactNode) => {
      showToast(message, "warning", duration, action);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number, action?: React.ReactNode) => {
      showToast(message, "info", duration, action);
    },
    [showToast]
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Render all toasts */}
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => hideToast(toast.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          TransitionComponent={SlideTransition}
          sx={{
            mb: index * 8, // Stack toasts with spacing
            "& .MuiSnackbarContent-root": {
              minWidth: "300px",
            },
          }}
        >
          <Alert
            onClose={() => hideToast(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{
              width: "100%",
              minWidth: "300px",
              maxWidth: "500px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              borderRadius: "12px",
              fontSize: "0.875rem",
              fontWeight: 500,
              "& .MuiAlert-icon": {
                fontSize: "1.25rem",
              },
              "& .MuiAlert-message": {
                display: "flex",
                alignItems: "center",
                gap: 1,
                flex: 1,
              },
              "& .MuiAlert-action": {
                paddingLeft: 1,
              },
            }}
            action={toast.action}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
