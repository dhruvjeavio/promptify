import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  ContentCopy,
  Download,
  Star,
  CheckCircle,
  Lightbulb,
  History,
} from "@mui/icons-material";
import type { PromptAnalysisHistory } from "../types/index";
import { useToast } from "../contexts/ToastContext";

interface PromptAnalysisHistoryModalProps {
  open: boolean;
  onClose: () => void;
  history: PromptAnalysisHistory[];
  onLoadAnalysis: (analysis: PromptAnalysisHistory) => void;
}

const PromptAnalysisHistoryModal: React.FC<PromptAnalysisHistoryModalProps> = ({
  open,
  onClose,
  history,
  onLoadAnalysis,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { showSuccess, showError } = useToast();

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      showSuccess("Prompt copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy prompt:", error);
      showError("Failed to copy prompt");
    }
  };

  const handleDownloadAnalysis = (analysis: PromptAnalysisHistory) => {
    const content = `Generated Text:\n${analysis.generated_text}\n\nRefined Prompt:\n${analysis.analysis.refined_prompt}\n\nScore: ${analysis.analysis.overall_score}/10\n\nImprovements:\n${analysis.analysis.improvements_made.join("\n")}\n\nAnalyzed at: ${new Date(analysis.created_at).toLocaleString()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-analysis-${analysis.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "success";
    if (score >= 6) return "warning";
    return "error";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    return "Needs Improvement";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <History sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6">Analysis History</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {history.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <History sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Analysis History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Run some prompt analyses to see your history here.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {history.map((analysis, index) => (
              <Card key={analysis.id} sx={{ position: "relative" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Analysis #{history.length - index}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(analysis.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Load this analysis">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onLoadAnalysis(analysis)}
                        >
                          Load
                        </Button>
                      </Tooltip>
                      <Tooltip title="Copy refined prompt">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopyPrompt(analysis.analysis.refined_prompt)
                          }
                        >
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download analysis">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadAnalysis(analysis)}
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Overall Score */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Star
                        sx={{ color: "primary.main", mr: 1, fontSize: 20 }}
                      />
                      <Typography variant="subtitle2">
                        Overall Score: {analysis.analysis.overall_score}/10
                      </Typography>
                      <Chip
                        label={getScoreLabel(analysis.analysis.overall_score)}
                        color={
                          getScoreColor(analysis.analysis.overall_score) as
                            | "success"
                            | "warning"
                            | "error"
                        }
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(analysis.analysis.overall_score / 10) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  {/* Detailed Scores */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Detailed Scores:
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Clarity: {analysis.analysis.clarity}/10
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(analysis.analysis.clarity / 10) * 100}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Specificity: {analysis.analysis.specificity}/10
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(analysis.analysis.specificity / 10) * 100}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Effectiveness: {analysis.analysis.effectiveness}/10
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(analysis.analysis.effectiveness / 10) * 100}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Improvements */}
                  {analysis.analysis.improvements_made.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Key Improvements:
                      </Typography>
                      <List dense sx={{ py: 0 }}>
                        {analysis.analysis.improvements_made
                          .slice(0, 3)
                          .map((improvement, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 24 }}>
                                <CheckCircle color="success" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary={improvement}
                                primaryTypographyProps={{ variant: "caption" }}
                              />
                            </ListItem>
                          ))}
                        {analysis.analysis.improvements_made.length > 3 && (
                          <ListItem sx={{ py: 0.5, px: 0 }}>
                            <ListItemText
                              primary={`+${analysis.analysis.improvements_made.length - 3} more improvements`}
                              primaryTypographyProps={{
                                variant: "caption",
                                color: "text.secondary",
                              }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  )}

                  {/* Suggestions */}
                  {analysis.analysis.additional_suggestions.length > 0 && (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Suggestions:
                      </Typography>
                      <List dense sx={{ py: 0 }}>
                        {analysis.analysis.additional_suggestions
                          .slice(0, 2)
                          .map((suggestion, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 24 }}>
                                <Lightbulb color="warning" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText
                                primary={suggestion}
                                primaryTypographyProps={{ variant: "caption" }}
                              />
                            </ListItem>
                          ))}
                        {analysis.analysis.additional_suggestions.length >
                          2 && (
                          <ListItem sx={{ py: 0.5, px: 0 }}>
                            <ListItemText
                              primary={`+${analysis.analysis.additional_suggestions.length - 2} more suggestions`}
                              primaryTypographyProps={{
                                variant: "caption",
                                color: "text.secondary",
                              }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  )}

                  {index < history.length - 1 && <Divider sx={{ mt: 2 }} />}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromptAnalysisHistoryModal;
