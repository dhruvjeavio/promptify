import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Avatar,
} from "@mui/material";
import { Person, Lock } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { LoginFormData } from "../types/index";
import { useTheme } from "../theme/useTheme";
import { EnhancedAlert } from "../components";

const schema = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
    .required("Password is required"),
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
  const { mode } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    onLogin(data);
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
            <Box sx={{ mb: 3 }}>
              <Avatar
                src={`/${mode === "dark" ? "Dark Icon.png" : "Light Icon.png"}`}
                alt="Promptify Logo"
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  mx: "auto",
                  mb: 2,
                  boxShadow: 3,
                }}
              />
            </Box>
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
            <EnhancedAlert severity="error" sx={{ mb: 3 }}>
              {error}
            </EnhancedAlert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Username *"
                  placeholder="Enter your username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
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
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password *"
                  type="password"
                  placeholder="Enter your password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <Lock sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                  sx={{ mb: 4 }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
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
