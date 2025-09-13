import React from "react";
import { Card as MuiCard } from "@mui/material";
import type { CardProps as MuiCardProps } from "@mui/material";

interface CardProps extends MuiCardProps {
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ hover = false, sx, ...props }) => {
  return (
    <MuiCard
      sx={{
        cursor: hover ? "pointer" : "default",
        transition: "all 0.2s ease-in-out",
        "&:hover": hover
          ? {
              transform: "translateY(-2px)",
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "0 4px 12px rgba(0,0,0,0.15)"
                  : "0 4px 12px rgba(255,255,255,0.15)",
            }
          : {},
        ...sx,
      }}
      {...props}
    />
  );
};

export default Card;
