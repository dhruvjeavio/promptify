import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  Autocomplete,
} from "@mui/material";
import { Person, Email, Work } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { LoginFormData } from "../types/index";
import { useGetRolesQuery } from "../services/apiSlice";

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters")
    .required("Email is required"),
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  role: yup
    .string()
    .trim()
    .min(2, "Role must be at least 2 characters")
    .max(50, "Role must be less than 50 characters")
    .required("Role is required"),
});

interface LoginPageProps {
  onLogin: (userData: LoginFormData) => void;
  error?: string;
  loading?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  error,
  loading = false,
}) => {
  const [showCustomRole, setShowCustomRole] = React.useState(false);
  const [customRole, setCustomRole] = React.useState("");
  const { data: roles = [], isLoading: rolesLoading } = useGetRolesQuery();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      name: "",
      role: "",
    },
  });

  const watchedRole = watch("role");

  React.useEffect(() => {
    if (watchedRole === "Other") {
      setShowCustomRole(true);
    } else {
      setShowCustomRole(false);
      setCustomRole("");
    }
  }, [watchedRole]);

  const onSubmit = (data: LoginFormData) => {
    // Validate custom role if "Other" is selected
    if (showCustomRole) {
      if (!customRole.trim()) {
        return; // Don't submit if custom role is required but empty
      }
      if (customRole.trim().length < 2) {
        return; // Don't submit if custom role is too short
      }
      if (customRole.trim().length > 50) {
        return; // Don't submit if custom role is too long
      }
    }

    const finalData = {
      ...data,
      role: showCustomRole && customRole ? customRole.trim() : data.role,
    };
    onLogin(finalData);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: { xs: 4, sm: 8 },
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 6 },
            width: "100%",
            maxWidth: 500,
            borderRadius: 3,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "primary.main",
                fontSize: { xs: "1.75rem", sm: "3rem" },
              }}
            >
              Welcome to Promptify
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Sign in to access your prompt library
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <Email sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full Name"
                  placeholder="Enter your full name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <Person sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Autocomplete
                  {...field}
                  options={roles}
                  value={value || ""}
                  onChange={(_, newValue) => onChange(newValue || "")}
                  loading={rolesLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Role"
                      placeholder="Select your role"
                      error={!!errors.role}
                      helperText={errors.role?.message}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <Work sx={{ mr: 1, color: "action.active" }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  sx={{ mb: 4 }}
                  freeSolo
                  disableClearable
                />
              )}
            />

            {showCustomRole && (
              <TextField
                fullWidth
                label="Custom Role"
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
                InputProps={{
                  startAdornment: (
                    <Work sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{ mb: 3 }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={
                loading ||
                (showCustomRole &&
                  (!customRole.trim() ||
                    customRole.trim().length < 2 ||
                    customRole.trim().length > 50))
              }
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
