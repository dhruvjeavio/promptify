import React, { useState } from "react";
import { Box, Typography, TextField, IconButton, Tooltip } from "@mui/material";
import { Edit, Check, Close } from "@mui/icons-material";

interface EditableTitleProps {
  title: string;
  onSave: (newTitle: string) => Promise<void>;
  variant?: "h4" | "h6";
  sx?: object;
  disabled?: boolean;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  title,
  onSave,
  variant = "h6",
  sx = {},
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(title);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(title);
  };

  const handleSave = async () => {
    if (editValue.trim() === title.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save title:", error);
      // Reset to original value on error
      setEditValue(title);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, ...sx }}>
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          variant="outlined"
          size="small"
          fullWidth
          disabled={isSaving}
          autoFocus
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: variant === "h4" ? "2.125rem" : "1.25rem",
              fontWeight: 600,
            },
          }}
        />
        <Tooltip title="Save">
          <IconButton
            size="small"
            color="primary"
            onClick={handleSave}
            disabled={isSaving || !editValue.trim()}
          >
            <Check />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <Close />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, ...sx }}>
      <Typography
        variant={variant}
        sx={{
          flex: 1,
          wordBreak: "break-word",
          fontSize:
            variant === "h4" ? { xs: "1.75rem", sm: "2.125rem" } : undefined,
          fontWeight: 600,
        }}
      >
        {title}
      </Typography>
      {!disabled && (
        <Tooltip title="Edit title">
          <IconButton
            size="small"
            color="primary"
            onClick={handleEdit}
            sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default EditableTitle;
