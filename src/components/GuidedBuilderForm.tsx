import React from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  TextField,
  Autocomplete,
  Slider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { PromptFormData } from "../types/index";

const schema = yup.object({
  goal: yup
    .string()
    .required("Goal is required")
    .min(10, "Goal must be at least 10 characters"),
  targetAudience: yup.string().required("Target audience is required"),
  context: yup
    .string()
    .required("Context is required")
    .min(20, "Context must be at least 20 characters"),
  outputFormat: yup.string().required("Output format is required"),
  temperature: yup
    .number()
    .min(0, "Temperature must be at least 0")
    .max(2, "Temperature must be at most 2")
    .required("Temperature is required"),
  tone: yup.string().required("Tone is required"),
  maxLength: yup
    .number()
    .min(50, "Max length must be at least 50")
    .max(2000, "Max length must be at most 2000")
    .required("Max length is required"),
  creativity: yup.string().required("Creativity level is required"),
  specificity: yup.string().required("Specificity level is required"),
});

const steps = [
  "Define Goal",
  "Set Audience",
  "Add Context",
  "Choose Format",
  "Configure Parameters",
];

const outputFormats = [
  "Paragraph",
  "Bullet Points",
  "Step-by-step Instructions",
  "Code",
  "Email Template",
  "Report",
  "List",
  "Table",
  "JSON",
  "Markdown",
];

const tones = [
  "Professional",
  "Casual",
  "Friendly",
  "Formal",
  "Conversational",
  "Technical",
  "Creative",
  "Persuasive",
  "Educational",
  "Humorous",
];

const creativityLevels = [
  "Conservative",
  "Balanced",
  "Creative",
  "Highly Creative",
  "Experimental",
];

const specificityLevels = [
  "General",
  "Moderately Specific",
  "Specific",
  "Very Specific",
  "Highly Detailed",
];

const commonTags = [
  "productivity",
  "writing",
  "coding",
  "analysis",
  "creative",
  "business",
  "technical",
  "educational",
  "marketing",
  "research",
];

interface GuidedBuilderFormProps {
  onSubmit: (data: PromptFormData & { tags: string[] }) => void;
  loading?: boolean;
}

const GuidedBuilderForm: React.FC<GuidedBuilderFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [tags, setTags] = React.useState<string[]>([]);
  const [isPublic, setIsPublic] = React.useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<PromptFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      goal: "",
      targetAudience: "",
      context: "",
      outputFormat: "",
      temperature: 0.7,
      tone: "Professional",
      maxLength: 500,
      creativity: "Balanced",
      specificity: "Specific",
    },
  });

  // const watchedValues = watch(); // Unused for now

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getFieldsForStep = (step: number): (keyof PromptFormData)[] => {
    switch (step) {
      case 0:
        return ["goal"];
      case 1:
        return ["targetAudience"];
      case 2:
        return ["context"];
      case 3:
        return ["outputFormat"];
      case 4:
        return [
          "temperature",
          "tone",
          "maxLength",
          "creativity",
          "specificity",
        ];
      default:
        return [];
    }
  };

  const onFormSubmit = (data: PromptFormData) => {
    onSubmit({ ...data, tags });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              What do you want to achieve?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Describe the main goal or purpose of your prompt. Be specific
              about what you want the AI to accomplish.
            </Typography>
            <Controller
              name="goal"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Goal"
                  placeholder="e.g., Create a comprehensive project plan for a mobile app launch including timeline, resources, and milestones"
                  error={!!errors.goal}
                  helperText={errors.goal?.message}
                />
              )}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Who is your target audience?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Specify who will be using this prompt or who the output is
              intended for.
            </Typography>
            <Controller
              name="targetAudience"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Target Audience"
                  placeholder="e.g., Product Managers, Developers, Marketing Team, Students"
                  error={!!errors.targetAudience}
                  helperText={errors.targetAudience?.message}
                />
              )}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Provide context and background
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add any relevant context, constraints, or background information
              that will help the AI understand the situation better.
            </Typography>
            <Controller
              name="context"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={5}
                  label="Context"
                  placeholder="e.g., This is for a startup with limited resources, tight timeline, and need to prioritize features based on user feedback..."
                  error={!!errors.context}
                  helperText={errors.context?.message}
                />
              )}
            />
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose output format and add tags
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select how you want the AI to structure its response and add
              relevant tags for better discoverability.
            </Typography>

            <Controller
              name="outputFormat"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.outputFormat}
                  sx={{ mb: 3 }}
                >
                  <InputLabel>Output Format</InputLabel>
                  <Select {...field} label="Output Format">
                    {outputFormats.map((format) => (
                      <MenuItem key={format} value={format}>
                        {format}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.outputFormat && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, ml: 2 }}
                    >
                      {errors.outputFormat.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Autocomplete
              multiple
              freeSolo
              options={commonTags}
              value={tags}
              onChange={(_, newValue) => setTags(newValue)}
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
                  label="Tags"
                  placeholder="Add tags to help others discover your prompt"
                />
              )}
            />

            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                }
                label="Make this prompt public (visible to everyone)"
              />
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configure AI Parameters
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Fine-tune the AI's behavior and output characteristics for your
              specific needs.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Temperature: {watch("temperature") || 0.7}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 2, display: "block" }}
                >
                  Controls randomness (0 = deterministic, 2 = very creative)
                </Typography>
                <Controller
                  name="temperature"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      {...field}
                      min={0}
                      max={2}
                      step={0.1}
                      marks={[
                        { value: 0, label: "0" },
                        { value: 1, label: "1" },
                        { value: 2, label: "2" },
                      ]}
                      valueLabelDisplay="auto"
                      sx={{ mb: 3 }}
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Max Length: {watch("maxLength") || 500}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 2, display: "block" }}
                >
                  Maximum length of the generated response
                </Typography>
                <Controller
                  name="maxLength"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      {...field}
                      min={50}
                      max={2000}
                      step={50}
                      marks={[
                        { value: 50, label: "50" },
                        { value: 1000, label: "1000" },
                        { value: 2000, label: "2000" },
                      ]}
                      valueLabelDisplay="auto"
                      sx={{ mb: 3 }}
                    />
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="tone"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.tone} sx={{ mb: 3 }}>
                      <InputLabel>Tone</InputLabel>
                      <Select {...field} label="Tone">
                        {tones.map((tone) => (
                          <MenuItem key={tone} value={tone}>
                            {tone}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.tone && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, ml: 2 }}
                        >
                          {errors.tone.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="creativity"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      error={!!errors.creativity}
                      sx={{ mb: 3 }}
                    >
                      <InputLabel>Creativity Level</InputLabel>
                      <Select {...field} label="Creativity Level">
                        {creativityLevels.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.creativity && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, ml: 2 }}
                        >
                          {errors.creativity.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Box>

              <Box>
                <Controller
                  name="specificity"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.specificity}>
                      <InputLabel>Specificity Level</InputLabel>
                      <Select {...field} label="Specificity Level">
                        {specificityLevels.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.specificity && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{ mt: 1, ml: 2 }}
                        >
                          {errors.specificity.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
            </Box>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, sm: 0 } }}>
      <Stepper
        activeStep={activeStep}
        sx={{
          mb: 4,
          "& .MuiStepLabel-label": {
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
          },
        }}
        orientation="horizontal"
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  display: { xs: "none", sm: "block" },
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        {getStepContent(activeStep)}
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          fullWidth={isMobile}
        >
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit(onFormSubmit)}
            disabled={loading}
            fullWidth={isMobile}
          >
            {loading ? "Creating..." : "Create Prompt"}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext} fullWidth={isMobile}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default GuidedBuilderForm;
