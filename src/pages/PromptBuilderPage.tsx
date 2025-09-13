import React from "react";
import { Box, Typography, Container, Alert } from "@mui/material";
import { useCreatePromptMutation } from "../services/apiSlice";
import { useNavigate } from "react-router-dom";
import GuidedBuilderForm from "../components/GuidedBuilderForm";
import type { PromptFormData } from "../types/index";

const PromptBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const [createPrompt, { isLoading, error }] = useCreatePromptMutation();

  const handleSubmit = async (
    formData: PromptFormData & { tags: string[] }
  ) => {
    try {
      // Generate the prompt text based on form data
      const promptText = generatePromptText(formData);

      const newPrompt = {
        title: formData.goal.substring(0, 100), // Use first 100 chars of goal as title
        promptText,
        intendedUse: formData.goal,
        targetAudience: formData.targetAudience,
        tags: formData.tags,
        isPublic: true, // For now, all prompts are public
      };

      const result = await createPrompt(newPrompt).unwrap();
      navigate(`/prompts/${result.id}`);
    } catch (err) {
      console.error("Failed to create prompt:", err);
    }
  };

  const generatePromptText = (formData: PromptFormData): string => {
    const { goal, targetAudience, context, outputFormat } = formData;

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
            Use our guided builder to create effective AI prompts. Follow the
            steps to define your goal, target audience, context, and desired
            output format.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Failed to create prompt. Please try again.
          </Alert>
        )}

        <GuidedBuilderForm onSubmit={handleSubmit} loading={isLoading} />
      </Container>
    </Box>
  );
};

export default PromptBuilderPage;
