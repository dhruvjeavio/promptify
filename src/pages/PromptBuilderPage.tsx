import React, { useState } from "react";
import { Box, Typography, Container, Alert, Tabs, Tab } from "@mui/material";
import { useCreatePromptMutation } from "../services/apiSlice";
import { useNavigate } from "react-router-dom";
import GuidedBuilderForm from "../components/GuidedBuilderForm";
import SharingPromptTemplates from "../components/SharingPromptTemplates";
import type { PromptFormData } from "../types/index";

const PromptBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [createPrompt, { isLoading, error }] = useCreatePromptMutation();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<PromptFormData | null>(null);

  const handleSubmit = async (
    submitData: PromptFormData & { tags: string[] }
  ) => {
    try {
      // Generate the prompt text based on form data
      const promptText = generatePromptText(submitData);

      const newPrompt = {
        title: submitData.goal.substring(0, 100), // Use first 100 chars of goal as title
        promptText,
        intendedUse: submitData.goal,
        targetAudience: submitData.targetAudience,
        tags: submitData.tags,
        isPublic: true, // For now, all prompts are public
      };

      const result = await createPrompt(newPrompt).unwrap();
      navigate(`/prompts/${result.id}`);
    } catch (err) {
      console.error("Failed to create prompt:", err);
    }
  };

  const handleTemplateSelect = (templateData: PromptFormData) => {
    setFormData(templateData);
    setActiveTab(1); // Switch to the form tab
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const generatePromptText = (formData: PromptFormData): string => {
    const { goal, targetAudience, context, outputFormat } = formData;

    // Check if this is a sharing-related prompt
    const isSharingPrompt =
      goal.toLowerCase().includes("share") ||
      goal.toLowerCase().includes("public link") ||
      goal.toLowerCase().includes("social media") ||
      goal.toLowerCase().includes("promote");

    if (isSharingPrompt) {
      return generateSharingPromptText(formData);
    }

    let promptText = `You are a helpful AI assistant. Your task is to help with the following:\n\n`;
    promptText += `**Goal:** ${goal}\n\n`;
    promptText += `**Target Audience:** ${targetAudience}\n\n`;

    if (context) {
      promptText += `**Context:** ${context}\n\n`;
    }

    promptText += `**Output Format:** Please provide your response in ${outputFormat.toLowerCase()} format.\n\n`;
    promptText += `Please provide a comprehensive and helpful response that addresses the goal while being appropriate for the target audience.`;

    return promptText;
  };

  const generateSharingPromptText = (formData: PromptFormData): string => {
    const { goal, targetAudience, context, outputFormat } = formData;

    let promptText = `You are a social media and content sharing expert. Your task is to help create compelling content for sharing public links and promoting content.\n\n`;
    promptText += `**Goal:** ${goal}\n\n`;
    promptText += `**Target Audience:** ${targetAudience}\n\n`;

    if (context) {
      promptText += `**Context:** ${context}\n\n`;
    }

    promptText += `**Output Format:** Please provide your response in ${outputFormat.toLowerCase()} format.\n\n`;
    promptText += `**Instructions:**\n`;
    promptText += `- Create engaging, shareable content that encourages clicks and engagement\n`;
    promptText += `- Include relevant hashtags and mentions where appropriate\n`;
    promptText += `- Consider the platform-specific best practices for the target audience\n`;
    promptText += `- Make the content authentic and valuable to the audience\n`;
    promptText += `- Include a clear call-to-action when appropriate\n`;
    promptText += `- Ensure the content is optimized for the specified output format\n\n`;
    promptText += `Please provide a comprehensive and engaging response that will help maximize the reach and impact of the shared content.`;

    return promptText;
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Create a New Prompt
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Use our guided builder to create effective AI prompts. Choose from
            sharing templates or build your own custom prompt.
          </Typography>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to create prompt. Please try again.
          </Alert>
        ) : null}

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Sharing Templates" />
            <Tab label="Custom Prompt" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <SharingPromptTemplates onSelectTemplate={handleTemplateSelect} />
        )}

        {activeTab === 1 && (
          <GuidedBuilderForm
            onSubmit={handleSubmit}
            loading={isLoading}
            initialData={formData}
          />
        )}
      </Container>
    </Box>
  );
};

export default PromptBuilderPage;
