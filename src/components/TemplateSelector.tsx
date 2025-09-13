import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Search,
  FilterList,
  ExpandMore,
  ExpandLess,
  AccessTime,
  Category,
  Person,
} from "@mui/icons-material";
import {
  useGetTemplateCategoriesQuery,
  useGetAllTemplatesQuery,
} from "../services/apiSlice";
import type { PromptFormData } from "../types/index";
import type { PromptTemplate } from "../services/mockDataService";

interface TemplateSelectorProps {
  onSelectTemplate: (template: PromptFormData) => void;
  userRole?: string;
  showCategories?: boolean;
  maxTemplates?: number;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelectTemplate,
  showCategories = true,
  maxTemplates = 12,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories = [] } = useGetTemplateCategoriesQuery();
  const { data: allTemplates = [], isLoading: templatesLoading } =
    useGetAllTemplatesQuery();

  // Filter templates based on selected category, search, and difficulty
  const filteredTemplates = allTemplates
    .filter((template) => {
      // Category filter
      if (
        selectedCategory !== "all" &&
        template.category !== selectedCategory
      ) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          template.title.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          template.useCases.some((useCase) =>
            useCase.toLowerCase().includes(query)
          )
        );
      }

      // Difficulty filter
      if (
        difficultyFilter !== "all" &&
        template.difficulty !== difficultyFilter
      ) {
        return false;
      }

      return true;
    })
    .slice(0, maxTemplates);

  const handleCategoryChange = (
    _event: React.SyntheticEvent,
    newValue: string
  ) => {
    setSelectedCategory(newValue);
  };

  const handleTemplateSelect = (template: PromptTemplate) => {
    onSelectTemplate(template.formData);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "warning";
      case "Advanced":
        return "error";
      default:
        return "default";
    }
  };

  const categoriesWithAll = [
    {
      id: "all",
      name: "All Templates",
      description: "Show all available templates",
      icon: "🌟",
    },
    ...categories,
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Choose a Template
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select from our curated templates to get started quickly, or create a
          custom prompt.
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                label="Difficulty"
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Collapse>
      </Box>

      {/* Category Tabs */}
      {showCategories && (
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            {categoriesWithAll.map((category) => (
              <Tab
                key={category.id}
                value={category.id}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>
      )}

      {/* Templates Grid */}
      {templatesLoading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography>Loading templates...</Typography>
        </Box>
      ) : filteredTemplates.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No templates found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters.
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
            },
            gap: 3,
          }}
        >
          {filteredTemplates.map((template) => (
            <Box key={template.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ flexGrow: 1 }}
                    >
                      {template.title}
                    </Typography>
                    <Chip
                      label={template.difficulty}
                      color={getDifficultyColor(template.difficulty)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, minHeight: 40 }}
                  >
                    {template.description}
                  </Typography>

                  <Box
                    sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                  >
                    {template.tags.slice(0, 3).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {template.tags.length > 3 && (
                      <Chip
                        label={`+${template.tags.length - 3}`}
                        size="small"
                        variant="outlined"
                        color="default"
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Tooltip title="Estimated time">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {template.estimatedTime}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Category">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Category fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {template.category}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 2,
                    }}
                  >
                    <Person fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {template.formData.role}
                    </Typography>
                  </Box>

                  {/* Expandable details */}
                  <Collapse in={expandedTemplate === template.id}>
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: "background.default",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        Goal:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {template.formData.goal}
                      </Typography>

                      <Typography variant="subtitle2" gutterBottom>
                        Target Audience:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {template.formData.targetAudience}
                      </Typography>

                      <Typography variant="subtitle2" gutterBottom>
                        Use Cases:
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {template.useCases.map((useCase) => (
                          <Chip
                            key={useCase}
                            label={useCase}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>

                <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleTemplateSelect(template)}
                    fullWidth
                    sx={{ mr: 1 }}
                  >
                    Use Template
                  </Button>
                  <IconButton
                    onClick={() =>
                      setExpandedTemplate(
                        expandedTemplate === template.id ? null : template.id
                      )
                    }
                    size="small"
                  >
                    {expandedTemplate === template.id ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Results count */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredTemplates.length} template
          {filteredTemplates.length !== 1 ? "s" : ""}
          {selectedCategory !== "all" &&
            ` in ${categories.find((c) => c.id === selectedCategory)?.name}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default TemplateSelector;
