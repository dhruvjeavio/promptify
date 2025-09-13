import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Search, Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useGetPromptsQuery,
  useDeletePromptMutation,
  useUpdatePromptMutation,
} from "../services/apiSlice";
import PromptCard from "../components/PromptCard";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { useAuth } from "../contexts/useAuth";

const MyLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  const { data: allPrompts = [], error, isLoading } = useGetPromptsQuery();

  // Filter for private prompts (is_shared: false)
  const prompts = allPrompts.filter(
    (prompt) => !prompt.isPublic && prompt.author === user?.username
  );

  const [deletePrompt] = useDeletePromptMutation();
  const [updatePrompt] = useUpdatePromptMutation();

  const handleDeleteClick = (promptId: string) => {
    setPromptToDelete(promptId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (promptToDelete) {
      try {
        await deletePrompt(promptToDelete).unwrap();
        setDeleteModalOpen(false);
        setPromptToDelete(null);
      } catch (error) {
        console.error("Failed to delete prompt:", error);
      }
    }
  };

  const handleTitleUpdate = async (promptId: string, newTitle: string) => {
    try {
      await updatePrompt({
        id: promptId,
        title: newTitle,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update title:", error);
      throw error; // Re-throw to let EditableTitle handle the error
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPromptToDelete(null);
  };

  // Filter and sort prompts
  const filteredPrompts = prompts
    .filter((prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.promptText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.intendedUse.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime()
          );
        case "rating":
          return b.rating - a.rating;
        case "upvotes":
          return b.upvotes - a.upvotes;
        default:
          return 0;
      }
    });

  if (isLoading) {
    return <Loader fullScreen message="Loading your prompts..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load your prompts. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 4,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
          >
            My Workshop
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal collection of prompts.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/builder")}
          sx={{
            minWidth: { xs: "100%", sm: 140 },
            alignSelf: { xs: "stretch", sm: "flex-start" },
          }}
        >
          Create Prompt
        </Button>
      </Box>

      {/* Search and Sort Controls */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              fullWidth
              placeholder="Search your prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ minWidth: { xs: "100%", md: "250px" } }}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort by"
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em>Select sorting option...</em>
                </MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
                <MenuItem value="upvotes">Most Upvoted</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Active Filters */}
      {searchTerm && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Active filters:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={`Search: "${searchTerm}"`}
              onDelete={() => setSearchTerm("")}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""}{" "}
        found
      </Typography>

      {/* Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
          }}
        >
          <Add sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? "No prompts found" : "No prompts yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm
              ? "Try adjusting your search criteria."
              : "Create your first prompt to get started!"}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/builder")}
            >
              Create Your First Prompt
            </Button>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {filteredPrompts.map((prompt) => (
            <Box key={prompt.id} sx={{ position: "relative" }}>
              <PromptCard
                prompt={prompt}
                onUpvote={() => {}} // No upvoting for own prompts
                onTitleUpdate={handleTitleUpdate}
                showUpvote={false}
                allowTitleEdit={true}
              />

              {/* Action buttons overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 0.5,
                  opacity: 0,
                  transition: "opacity 0.2s",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                <Tooltip title="Edit prompt">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/prompts/${prompt.id}`);
                    }}
                    sx={{ bgcolor: "background.paper" }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete prompt">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(prompt.id);
                    }}
                    sx={{ bgcolor: "background.paper" }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete Prompt"
        actions={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </Box>
        }
      >
        <Typography>
          Are you sure you want to delete this prompt? This action cannot be
          undone.
        </Typography>
      </Modal>
    </Box>
  );
};

export default MyLibraryPage;
