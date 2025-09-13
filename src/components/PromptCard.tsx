import React from "react";
import {
  Card as MuiCard,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Rating,
  Tooltip,
} from "@mui/material";
import {
  ThumbUpOutlined,
  ThumbUp,
  Visibility,
  Person,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Prompt } from "../types/index";
import EditableTitle from "./EditableTitle";

interface PromptCardProps {
  prompt: Prompt;
  onUpvote?: (promptId: string) => void;
  onTitleUpdate?: (promptId: string, newTitle: string) => Promise<void>;
  showUpvote?: boolean;
  allowTitleEdit?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onUpvote,
  onTitleUpdate,
  showUpvote = true,
  allowTitleEdit = false,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/prompts/${prompt.id}`);
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpvote?.(prompt.id);
  };

  const handleTitleUpdate = async (newTitle: string) => {
    if (onTitleUpdate) {
      await onTitleUpdate(prompt.id, newTitle);
    }
  };

  return (
    <MuiCard
      onClick={handleCardClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 4px 12px rgba(0,0,0,0.15)"
              : "0 4px 12px rgba(255,255,255,0.15)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <EditableTitle
          title={prompt.title}
          onSave={handleTitleUpdate}
          variant="h6"
          disabled={!allowTitleEdit}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "3.2em",
            mb: 2,
            fontWeight: 600,
          }}
        />

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 3,
            minHeight: "4.5em",
            lineHeight: 1.6,
          }}
        >
          {prompt.promptText}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Intended Use: {prompt.intendedUse}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Target: {prompt.targetAudience}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {prompt.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="medium"
              variant="outlined"
              color="primary"
              sx={{ fontSize: "0.75rem", height: "28px" }}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Person fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {prompt.author}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Rating value={prompt.rating} precision={0.1} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            ({prompt.rating.toFixed(1)})
          </Typography>
        </Box>
      </CardContent>

      <CardActions
        sx={{ justifyContent: "space-between", px: 3, pb: 3, pt: 0 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton size="small" color="primary">
              <Visibility />
            </IconButton>
          </Tooltip>

          {showUpvote && (
            <Tooltip title="Upvote">
              <IconButton size="small" color="primary" onClick={handleUpvote}>
                {prompt.upvotes > 0 ? <ThumbUp /> : <ThumbUpOutlined />}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary">
          {prompt.upvotes} upvotes
        </Typography>
      </CardActions>
    </MuiCard>
  );
};

export default PromptCard;
