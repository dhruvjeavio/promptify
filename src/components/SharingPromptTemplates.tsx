import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Paper,
  useTheme,
} from "@mui/material";
import { Share, TrendingUp, Link, BusinessCenter } from "@mui/icons-material";
import { useGetSharingTemplatesQuery } from "../services/apiSlice";
import type { PromptFormData } from "../types/index";

interface SharingPromptTemplatesProps {
  onSelectTemplate: (template: PromptFormData) => void;
}

const SharingPromptTemplates: React.FC<SharingPromptTemplatesProps> = ({
  onSelectTemplate,
}) => {
  const theme = useTheme();
  const {
    data: templates = [],
    isLoading,
    error,
  } = useGetSharingTemplatesQuery();
  const templatesArray = Array.isArray(templates) ? templates : [];
  const getIcon = (templateId: string) => {
    switch (templateId) {
      case "social-media-share":
        return <Share color="primary" />;
      case "link-promotion":
        return <Link color="primary" />;
      case "viral-content":
        return <TrendingUp color="primary" />;
      case "professional-sharing":
        return <BusinessCenter color="primary" />;
      default:
        return <Share color="primary" />;
    }
  };

  const handleTemplateSelect = (template: {
    id: string;
    template: {
      goal: string;
      targetAudience: string;
      context: string;
      outputFormat: string;
      creativity: string;
      specificity: string;
    };
  }) => {
    const formData: PromptFormData = {
      goal: template.template.goal,
      targetAudience: template.template.targetAudience,
      context: template.template.context,
      outputFormat: template.template.outputFormat,
      creativity: template.template.creativity,
      specificity: template.template.specificity,
      role: "", // Templates don't include role, user will need to select it
    };
    onSelectTemplate(formData);
  };

  if (isLoading) {
    return (
      <Box sx={{ mb: 4, textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Loading templates...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mb: 4, textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="error">
          Failed to load templates. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        Quick Start: Sharing Templates
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: "center", mb: 4, maxWidth: 600, mx: "auto" }}
      >
        Choose from our pre-built templates to quickly create prompts for
        sharing your content and public links across different platforms.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {templatesArray.map((template) => (
          <Card
            key={template.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {getIcon(template.id)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {template.title}
                </Typography>
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, minHeight: 40 }}
              >
                {template.description}
              </Typography>

              <Paper
                sx={{
                  p: 2,
                  bgcolor:
                    theme.palette.mode === "dark" ? "grey.800" : "grey.50",
                  border: "1px solid",
                  borderColor:
                    theme.palette.mode === "dark" ? "grey.700" : "grey.200",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  Sample Goal:
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  {template.template.goal}
                </Typography>
              </Paper>

              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                <Chip
                  label={template.template.creativity}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor:
                      theme.palette.mode === "dark" ? "grey.600" : "grey.400",
                    color:
                      theme.palette.mode === "dark" ? "grey.300" : "grey.700",
                  }}
                />
              </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleTemplateSelect(template)}
                sx={{ textTransform: "none" }}
              >
                Use This Template
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Don't see what you need?{" "}
          <Button
            variant="text"
            onClick={() => {
              // Scroll to the form or focus on it
              const formElement = document.querySelector(
                '[data-testid="guided-form"]'
              );
              if (formElement) {
                formElement.scrollIntoView({ behavior: "smooth" });
              }
            }}
            sx={{ textTransform: "none" }}
          >
            Create a custom prompt instead
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default SharingPromptTemplates;
