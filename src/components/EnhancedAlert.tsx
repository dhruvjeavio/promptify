import React from "react";
import { Alert } from "@mui/material";
import type { AlertProps } from "@mui/material/Alert";

interface EnhancedAlertProps extends AlertProps {
  children: React.ReactNode;
}

const EnhancedAlert: React.FC<EnhancedAlertProps> = ({
  children,
  sx,
  ...props
}) => {
  return (
    <Alert
      {...props}
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
        fontSize: "0.875rem",
        fontWeight: 500,
        "& .MuiAlert-icon": {
          fontSize: "1.25rem",
        },
        "& .MuiAlert-message": {
          display: "flex",
          alignItems: "center",
          flex: 1,
        },
        ...sx,
      }}
    >
      {children}
    </Alert>
  );
};

export default EnhancedAlert;
