import React from "react";
import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

interface InputProps extends Omit<TextFieldProps, "variant"> {
  variant?: "outlined" | "filled" | "standard";
}

const Input: React.FC<InputProps> = ({ variant = "outlined", ...props }) => {
  return <TextField variant={variant} fullWidth {...props} />;
};

export default Input;
