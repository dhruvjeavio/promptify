import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useTheme,
} from "@mui/material";
import {
  Share,
  ContentCopy,
  Email,
  Twitter,
  Facebook,
  LinkedIn,
  WhatsApp,
  Telegram,
  Close,
  CheckCircle,
} from "@mui/icons-material";
import type { Prompt } from "../types/index";

interface SharePromptProps {
  prompt: Prompt;
  open: boolean;
  onClose: () => void;
}

const SharePrompt: React.FC<SharePromptProps> = ({ prompt, open, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const theme = useTheme();

  const baseUrl = window.location.origin;
  const promptUrl = `${baseUrl}/prompts/${prompt.id}`;
  const shareText =
    customMessage || `Check out this amazing prompt: "${prompt.title}"`;
  const fullShareText = `${shareText}\n\n${promptUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(promptUrl);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleCopyWithMessage = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: prompt.title,
          text: shareText,
          url: promptUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copying to clipboard
      handleCopyLink();
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(promptUrl);
    const encodedText = encodeURIComponent(shareText);

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(prompt.title)}&body=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const socialPlatforms = [
    { name: "Twitter", icon: <Twitter />, color: "#1DA1F2" },
    { name: "Facebook", icon: <Facebook />, color: "#1877F2" },
    { name: "LinkedIn", icon: <LinkedIn />, color: "#0077B5" },
    { name: "WhatsApp", icon: <WhatsApp />, color: "#25D366" },
    { name: "Telegram", icon: <Telegram />, color: "#0088CC" },
    { name: "Email", icon: <Email />, color: "#EA4335" },
  ];

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.4)"
                : "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Share color="primary" />
              <Typography variant="h6">Share Prompt</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {/* Prompt Preview */}
          <Paper
            sx={{
              p: 2,
              mb: 3,
              bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.50",
              border: `1px solid ${theme.palette.mode === "dark" ? "grey.700" : "grey.200"}`,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {prompt.intendedUse}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {prompt.title}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
              {prompt.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor:
                      theme.palette.mode === "dark" ? "grey.600" : "grey.400",
                    color:
                      theme.palette.mode === "dark" ? "grey.300" : "grey.700",
                  }}
                />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" noWrap>
              {prompt.promptText.substring(0, 100)}...
            </Typography>
          </Paper>

          {/* Custom Message */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Custom message (optional)"
            placeholder="Add a personal message to your share..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Quick Actions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                startIcon={copied ? <CheckCircle /> : <ContentCopy />}
                onClick={handleCopyLink}
                color={copied ? "success" : "primary"}
                sx={{
                  borderColor:
                    theme.palette.mode === "dark" ? "grey.600" : "grey.400",
                  color:
                    theme.palette.mode === "dark" ? "grey.300" : "grey.700",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor:
                      theme.palette.mode === "dark" ? "grey.800" : "grey.50",
                  },
                }}
              >
                {copied ? "Copied!" : "Copy Link"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={handleCopyWithMessage}
                sx={{
                  borderColor:
                    theme.palette.mode === "dark" ? "grey.600" : "grey.400",
                  color:
                    theme.palette.mode === "dark" ? "grey.300" : "grey.700",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor:
                      theme.palette.mode === "dark" ? "grey.800" : "grey.50",
                  },
                }}
              >
                Copy with Message
              </Button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <Button
                  variant="contained"
                  startIcon={<Share />}
                  onClick={handleNativeShare}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  Share
                </Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Social Media Sharing */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Share on Social Media
            </Typography>
            <List dense>
              {socialPlatforms.map((platform) => (
                <ListItem key={platform.name} disablePadding>
                  <ListItemButton
                    onClick={() =>
                      handleSocialShare(platform.name.toLowerCase())
                    }
                    sx={{
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "grey.800"
                            : "grey.100",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        sx={{
                          color: platform.color,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {platform.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={platform.name}
                      sx={{
                        "& .MuiListItemText-primary": {
                          color: theme.palette.text.primary,
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Direct Link */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Direct Link
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                value={promptUrl}
                InputProps={{ readOnly: true }}
                size="small"
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "monospace",
                    color: theme.palette.text.primary,
                  },
                  "& .MuiOutlinedInput-root": {
                    bgcolor:
                      theme.palette.mode === "dark" ? "grey.800" : "grey.50",
                    "& fieldset": {
                      borderColor:
                        theme.palette.mode === "dark" ? "grey.600" : "grey.300",
                    },
                    "&:hover fieldset": {
                      borderColor:
                        theme.palette.mode === "dark" ? "grey.500" : "grey.400",
                    },
                  },
                }}
              />
              <Tooltip title="Copy link">
                <IconButton
                  onClick={handleCopyLink}
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.primary.main,
                      bgcolor:
                        theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                    },
                  }}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {copied ? "Copied to clipboard!" : "Link copied!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SharePrompt;
