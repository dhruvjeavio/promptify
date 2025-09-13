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
  TextField,
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { PromptFormData } from "../types/index";
import { useGetRolesQuery } from "../services/apiSlice";
import { useAuth } from "../contexts/useAuth";
import UnBlockGuide from "./UnBlockGuide";

const schema = yup.object({
  goal: yup
    .string()
    .required("Goal is required")
    .min(10, "Goal must be at least 10 characters"),
  targetAudience: yup.string().optional(),
  context: yup
    .string()
    .required("Context is required")
    .min(20, "Context must be at least 20 characters"),
  outputFormat: yup.string().optional(),
  creativity: yup.string().optional(),
  specificity: yup.string().optional(),
  role: yup.string().required("Role is required"),
});

const steps = [
  "Define Goal & Role",
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

const creativityStyles = [
  "Factual & Precise",
  "Balanced",
  "Creative & Suggestive",
];

const detailLevels = [
  "Brief & Concise",
  "Moderately Detailed",
  "Comprehensive & Detailed",
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

const stepTips = [
  "💡 Start by selecting your professional role - this helps the AI understand your perspective and provide more relevant suggestions. Then think about what specific outcome you want to achieve.",
  "🎯 Consider who will be using this prompt. Different audiences need different levels of detail and technical language.",
  "📝 Provide context about your situation, constraints, or background. This helps the AI understand your specific needs better.",
  "📋 Choose the format that best fits how you want to use the output. Tags help others discover your prompt in the community.",
  "⚙️ Select the creativity and detail level that matches your needs. More creative = more varied ideas, more detailed = comprehensive responses.",
];

interface GuidedBuilderFormProps {
  onSubmit: (data: PromptFormData & { tags: string[] }) => void;
  loading?: boolean;
  initialData?: PromptFormData | null;
}

const GuidedBuilderForm: React.FC<GuidedBuilderFormProps> = ({
  onSubmit,
  loading = false,
  initialData = null,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [tags, setTags] = React.useState<string[]>([]);
  const [showCustomRole, setShowCustomRole] = React.useState(false);
  const [customRole, setCustomRole] = React.useState("");
  const { data: roles = [], isLoading: rolesLoading } = useGetRolesQuery();
  const rolesArray = Array.isArray(roles) ? roles : [];
  const { updateUserRole, user } = useAuth();

  // Initialize tags from localStorage only once
  React.useEffect(() => {
    if (initialData) {
      setTags([]);
      return;
    }

    const savedData = localStorage.getItem("promptify-form-data");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTags(parsedData.tags || []);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, [initialData]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Get default values from localStorage or initial data (only on mount)
  const getDefaultValues = React.useMemo((): PromptFormData => {
    if (initialData) {
      return initialData;
    }

    // First check for saved form data
    const savedData = localStorage.getItem("promptify-form-data");
    let formData = {
      goal: "",
      targetAudience: "",
      context: "",
      outputFormat: "",
      creativity: "Balanced",
      specificity: "Moderately Detailed",
      role: "",
    };

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        formData = {
          goal: parsedData.goal || "",
          targetAudience: parsedData.targetAudience || "",
          context: parsedData.context || "",
          outputFormat: parsedData.outputFormat || "",
          creativity: parsedData.creativity || "Balanced",
          specificity: parsedData.specificity || "Moderately Detailed",
          role: parsedData.role || "",
        };
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }

    // Prioritize user role over form data
    if (user?.role) {
      formData.role = user.role;
    } else if (!formData.role) {
      // Fallback to localStorage if user context is not available
      const userData = localStorage.getItem("promptify_user");
      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          formData.role = parsedUserData.role || "";
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }

    return formData;
  }, [initialData, user]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    reset,
  } = useForm<PromptFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: getDefaultValues,
  });

  const watchedRole = watch("role");

  // Watch for role changes to show/hide custom role input
  React.useEffect(() => {
    if (watchedRole === "Other") {
      setShowCustomRole(true);
    } else {
      setShowCustomRole(false);
      setCustomRole("");
    }
  }, [watchedRole]);

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Save form data to localStorage
  const saveFormDataSilently = (data: PromptFormData) => {
    const formDataToSave = {
      ...data,
      tags,
    };
    localStorage.setItem("promptify-form-data", JSON.stringify(formDataToSave));
  };

  // const watchedValues = watch(); // Unused for now

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isValid = await trigger(fieldsToValidate);

    // Additional validation for custom role on step 0
    if (activeStep === 0 && showCustomRole) {
      if (
        !customRole.trim() ||
        customRole.trim().length < 2 ||
        customRole.trim().length > 50
      ) {
        return; // Don't proceed if custom role is invalid
      }
    }

    if (isValid) {
      // Save current form data before moving to next step
      const currentValues = watch();
      saveFormDataSilently(currentValues);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    // Save current form data before going back
    const currentValues = watch();
    saveFormDataSilently(currentValues);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getFieldsForStep = (step: number): (keyof PromptFormData)[] => {
    switch (step) {
      case 0:
        return ["goal", "role"];
      case 1:
        return ["targetAudience"];
      case 2:
        return ["context"];
      case 3:
        return ["outputFormat"];
      case 4:
        return ["creativity", "specificity"];
      default:
        return [];
    }
  };

  const onFormSubmit = (data: PromptFormData) => {
    // Handle custom role if "Other" is selected
    const finalRole =
      showCustomRole && customRole ? customRole.trim() : data.role;
    const finalData = {
      ...data,
      role: finalRole,
    };

    // Save role to user data for future autofill
    if (finalRole) {
      updateUserRole(finalRole);
    }

    // Clear localStorage after successful submission
    localStorage.removeItem("promptify-form-data");
    onSubmit({ ...finalData, tags });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <UnBlockGuide tip={stepTips[0]} />
            <Typography variant="h6" gutterBottom>
              What do you want to achieve?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Describe the main goal or purpose of your prompt. Be specific
              about what you want the AI to accomplish.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Controller
                name="role"
                control={control}
                key={step.toString()}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={rolesArray}
                    loading={rolesLoading}
                    freeSolo
                    value={field.value || ""}
                    onChange={(_, newValue) => {
                      field.onChange(newValue || "");
                    }}
                    onInputChange={(_, newInputValue) => {
                      field.onChange(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Your Role *"
                        placeholder="e.g., Product Manager, Developer, Designer"
                        error={!!errors.role}
                        helperText={
                          errors.role?.message ||
                          "Select or type your professional role"
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {rolesLoading ? "Loading..." : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />

              {showCustomRole && (
                <TextField
                  fullWidth
                  label="Custom Role *"
                  placeholder="Enter your custom role"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  error={
                    showCustomRole &&
                    (!customRole.trim() ||
                      customRole.trim().length < 2 ||
                      customRole.trim().length > 50)
                  }
                  helperText={
                    showCustomRole && !customRole.trim()
                      ? "Please enter your custom role"
                      : showCustomRole && customRole.trim().length < 2
                        ? "Custom role must be at least 2 characters"
                        : showCustomRole && customRole.trim().length > 50
                          ? "Custom role must be less than 50 characters"
                          : ""
                  }
                  sx={{ mt: 2 }}
                />
              )}

              <Controller
                name="goal"
                control={control}
                key={step.toString()}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Goal *"
                    placeholder="e.g., Generate 5 user stories for a new checkout page"
                    error={!!errors.goal}
                    helperText={errors.goal?.message}
                  />
                )}
              />
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <UnBlockGuide tip={stepTips[1]} />
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
              key={step.toString()}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Target Audience"
                  placeholder="e.g., For the engineering team and a project manager"
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
            <UnBlockGuide tip={stepTips[2]} />
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
              key={step.toString()}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={5}
                  label="Context *"
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
            <UnBlockGuide tip={stepTips[3]} />
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
                  <Select
                    {...field}
                    label="Output Format"
                    displayEmpty
                    value={field.value || ""}
                  >
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
              onChange={(_, newValue) => {
                setTags(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tags to help others discover your prompt"
                />
              )}
            />
          </Box>
        );

      case 4:
        return (
          <Box>
            <UnBlockGuide tip={stepTips[4]} />
            <Typography variant="h6" gutterBottom>
              Configure AI Behavior
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose how creative and detailed you want the AI's response to be.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                  Creativity Style
                </Typography>
                <Controller
                  name="creativity"
                  control={control}
                  key={step.toString()}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      {...field}
                      exclusive
                      fullWidth
                      size="large"
                      sx={{
                        "& .MuiToggleButton-root": {
                          flex: 1,
                          py: 1.5,
                          px: 2,
                        },
                      }}
                    >
                      {creativityStyles.map((style) => (
                        <ToggleButton key={style} value={style}>
                          {style}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  )}
                />
                {errors.creativity && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {errors.creativity.message}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                  Detail Level
                </Typography>
                <Controller
                  name="specificity"
                  control={control}
                  key={step.toString()}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      {...field}
                      exclusive
                      fullWidth
                      size="large"
                      sx={{
                        "& .MuiToggleButton-root": {
                          flex: 1,
                          py: 1.5,
                          px: 2,
                        },
                      }}
                    >
                      {detailLevels.map((level) => (
                        <ToggleButton key={level} value={level}>
                          {level}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  )}
                />
                {errors.specificity && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 1, display: "block" }}
                  >
                    {errors.specificity.message}
                  </Typography>
                )}
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
            disabled={
              loading ||
              (showCustomRole &&
                (!customRole.trim() ||
                  customRole.trim().length < 2 ||
                  customRole.trim().length > 50))
            }
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
