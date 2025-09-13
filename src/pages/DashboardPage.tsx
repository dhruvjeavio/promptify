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
  Autocomplete,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import {
  useGetPromptsQuery,
  useUpvotePromptMutation,
} from "../services/apiSlice";
import PromptCard from "../components/PromptCard";
import Loader from "../components/Loader";

const DashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const { data: allPrompts = [], error, isLoading } = useGetPromptsQuery();
  const prompts = allPrompts.filter((prompt) => prompt.isPublic);

  const [upvotePrompt] = useUpvotePromptMutation();

  const handleUpvote = (promptId: string) => {
    upvotePrompt(promptId);
  };

  // Get all unique tags from prompts
  const allTags = Array.from(
    new Set(prompts.flatMap((prompt) => prompt.tags))
  ).sort();

  // Filter and sort prompts
  const filteredPrompts = prompts
    .filter((prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.promptText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.intendedUse.toLowerCase().includes(searchTerm.toLowerCase());

      // Multi-tag filtering: prompt must contain ALL selected tags
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => prompt.tags.includes(tag));

      return matchesSearch && matchesTags;
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
    return <Loader fullScreen message="Loading prompts..." />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load prompts. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 4, md: 6 } }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
        Bookshelf
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mb: 6, maxWidth: "800px" }}
      >
        Discover and use prompts created by your team. Find the perfect prompt
        for your needs.
      </Typography>

      {/* Search and Filter Controls */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "center",
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              fullWidth
              placeholder="Search prompts..."
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

          <Box sx={{ minWidth: { xs: "100%", md: "300px" } }}>
            <Autocomplete
              multiple
              options={allTags}
              value={selectedTags}
              onChange={(_, newValue) => setSelectedTags(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter by Tags"
                  placeholder="Select multiple tags..."
                />
              )}
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
      {(searchTerm || selectedTags.length > 0) && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Active filters:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm("")}
                color="primary"
                variant="outlined"
              />
            )}
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                label={`Tag: ${tag}`}
                onDelete={() =>
                  setSelectedTags(selectedTags.filter((t) => t !== tag))
                }
                color="secondary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Results Count */}
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mb: 4, fontWeight: 500 }}
      >
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
          <FilterList sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No prompts found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || selectedTags.length > 0
              ? "Try adjusting your search criteria or filters."
              : "Be the first to create a prompt for your team!"}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 4,
          }}
        >
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onUpvote={handleUpvote}
              showUpvote={true}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage;
