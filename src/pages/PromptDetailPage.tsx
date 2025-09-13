import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Divider,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  ArrowBack,
  ThumbUp,
  ThumbUpOutlined,
  Edit,
  Share,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetPromptByIdQuery,
  useUpvotePromptMutation,
  useUpdatePromptMutation,
} from "../services/apiSlice";
import PromptRunner from "../components/PromptRunner";
import Loader from "../components/Loader";

const PromptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");

  const { data: prompt, error, isLoading } = useGetPromptByIdQuery(id!);

  const [upvotePrompt] = useUpvotePromptMutation();
  const [updatePrompt] = useUpdatePromptMutation();

  const handleUpvote = async () => {
    if (id) {
      try {
        await upvotePrompt(id).unwrap();
      } catch (error) {
        console.error("Failed to upvote prompt:", error);
      }
    }
  };

  const handleEdit = () => {
    if (prompt) {
      setEditedPrompt(prompt.promptText);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (id && editedPrompt !== prompt?.promptText) {
      try {
        await updatePrompt({
          id,
          promptText: editedPrompt,
        }).unwrap();
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update prompt:", error);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedPrompt(prompt?.promptText || "");
    setIsEditing(false);
  };

  const handlePromptUpdate = (updatedPrompt: string) => {
    setEditedPrompt(updatedPrompt);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt?.title,
          text: prompt?.promptText,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return <Loader fullScreen message="Loading prompt..." />;
  }

  if (error || !prompt) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Prompt not found or failed to load.</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate("/")}
          sx={{ textDecoration: "none" }}
        >
          Team Library
        </Link>
        <Typography variant="body2" color="text.primary">
          {prompt.title}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {prompt.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {prompt.author}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {prompt.upvotes} upvotes
                </Typography>
                <IconButton size="small" onClick={handleUpvote}>
                  {prompt.upvotes > 0 ? <ThumbUp /> : <ThumbUpOutlined />}
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {prompt.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Share prompt">
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Tooltip>

            <Tooltip title={isEditing ? "Cancel editing" : "Edit prompt"}>
              <IconButton onClick={isEditing ? handleCancel : handleEdit}>
                {isEditing ? <VisibilityOff /> : <Edit />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Intended Use
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {prompt.intendedUse}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Target Audience
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {prompt.targetAudience}
          </Typography>
        </Paper>
      </Box>

      {/* Prompt Runner */}
      <PromptRunner
        prompt={{
          ...prompt,
          promptText: isEditing ? editedPrompt : prompt.promptText,
        }}
        onPromptUpdate={handlePromptUpdate}
      />

      {/* Edit Actions */}
      {isEditing && (
        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      )}

      {/* Back Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default PromptDetailPage;
