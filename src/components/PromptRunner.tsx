import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  ContentCopy,
  Refresh,
  Download,
  Star,
  TrendingUp,
  Lightbulb,
  CheckCircle,
} from "@mui/icons-material";
import type { Prompt, PromptRefinement } from "../types/index";
import { useAnalyzePromptMutation } from "../services/apiSlice";

interface PromptRunnerProps {
  prompt: Prompt;
  onPromptUpdate?: (updatedPrompt: string) => void;
}

const PromptRunner: React.FC<PromptRunnerProps> = ({
  prompt,
  onPromptUpdate,
}) => {
  const [promptText, setPromptText] = useState(prompt.promptText);
  const [refinement, setRefinement] = useState<PromptRefinement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [analyzePrompt, { isLoading: isRunning }] = useAnalyzePromptMutation();

  const handleRunPrompt = async () => {
    if (!promptText.trim()) {
      setError("Please enter a prompt to analyze");
      return;
    }

    setError(null);
    setRefinement(null);

    try {
      const result = await analyzePrompt({ promptText }).unwrap();
      setRefinement(result);
    } catch {
      setError("Failed to analyze prompt. Please try again.");
    }
  };

  const handleCopyRefinedPrompt = () => {
    if (refinement) {
      navigator.clipboard.writeText(refinement.refinedPrompt);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
  };

  const handleDownloadRefinement = () => {
    if (refinement) {
      const content = `Original Prompt:\n${refinement.originalPrompt}\n\nRefined Prompt:\n${refinement.refinedPrompt}\n\nScore: ${refinement.score.overallScore}/10\n\nImprovements:\n${refinement.improvements.join("\n")}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prompt-refinement-${prompt.id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    setPromptText(prompt.promptText);
    setRefinement(null);
    setError(null);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Prompt Analyzer & Refiner
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Analyze your prompt quality and get AI-powered suggestions for
        improvement. Edit the prompt below and click "Analyze Prompt" to get
        scoring and refinement suggestions.
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={
            isRunning ? <CircularProgress size={20} /> : <TrendingUp />
          }
          onClick={handleRunPrompt}
          disabled={isRunning || !promptText.trim()}
        >
          {isRunning ? "Analyzing..." : "Analyze Prompt"}
        </Button>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
          disabled={isRunning}
        >
          Reset
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Prompt Input */}
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Prompt</Typography>
            <Tooltip title="Copy prompt">
              <IconButton onClick={handleCopyPrompt} size="small">
                <ContentCopy />
              </IconButton>
            </Tooltip>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={12}
            value={promptText}
            onChange={(e) => {
              setPromptText(e.target.value);
              onPromptUpdate?.(e.target.value);
            }}
            placeholder="Enter your prompt here..."
            variant="outlined"
            disabled={isRunning}
            sx={{
              "& .MuiInputBase-root": {
                fontFamily: "monospace",
                fontSize: "0.9rem",
              },
            }}
          />
        </Paper>

        {/* Analysis Results */}
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Analysis Results</Typography>
            {refinement && (
              <Box>
                <Tooltip title="Copy refined prompt">
                  <IconButton onClick={handleCopyRefinedPrompt} size="small">
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download analysis">
                  <IconButton onClick={handleDownloadRefinement} size="small">
                    <Download />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isRunning ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Analyzing prompt quality...
              </Typography>
            </Box>
          ) : refinement ? (
            <Box>
              {/* Overall Score */}
              <Card sx={{ mb: 3, bgcolor: "primary.50" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Star sx={{ color: "primary.main", mr: 1 }} />
                    <Typography variant="h6">
                      Overall Score: {refinement.score.overallScore}/10
                    </Typography>
                    <Chip
                      label={
                        refinement.score.overallScore >= 8
                          ? "Excellent"
                          : refinement.score.overallScore >= 6
                            ? "Good"
                            : "Needs Improvement"
                      }
                      color={
                        refinement.score.overallScore >= 8
                          ? "success"
                          : refinement.score.overallScore >= 6
                            ? "warning"
                            : "error"
                      }
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(refinement.score.overallScore / 10) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>

              {/* Detailed Scores */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Detailed Analysis
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Clarity: {refinement.score.clarity}/10
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(refinement.score.clarity / 10) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Specificity: {refinement.score.specificity}/10
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(refinement.score.specificity / 10) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Effectiveness: {refinement.score.effectiveness}/10
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(refinement.score.effectiveness / 10) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Refined Prompt */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Refined Prompt
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={refinement.refinedPrompt}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      fontFamily: "monospace",
                      fontSize: "0.9rem",
                    },
                  }}
                />
              </Box>

              {/* Improvements */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Improvements Made
                </Typography>
                <List dense>
                  {refinement.improvements.map((improvement, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={improvement} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Suggestions */}
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Additional Suggestions
                </Typography>
                <List dense>
                  {refinement.score.suggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Lightbulb color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Click "Analyze Prompt" to get quality scoring and refinement
                suggestions
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {refinement && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Tip:</strong> Use the copy and download buttons to save
            the refined prompt and analysis. You can also edit the prompt above
            and analyze it again to see different scoring and refinement
            suggestions.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PromptRunner;
