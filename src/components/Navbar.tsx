import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme as useCustomTheme } from "../theme/useTheme";
import { useAuth } from "../contexts/useAuth";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { Logout } from "@mui/icons-material";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleColorMode } = useCustomTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isActive = (path: string) => location.pathname === path;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    setMobileOpen(false);
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Promptify
        </Typography>
      </Box>
      <Divider />
      <List>
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation("/")}
                selected={isActive("/")}
              >
                <ListItemText primary="Team Library" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation("/my-library")}
                selected={isActive("/my-library")}
              >
                <ListItemText primary="My Library" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation("/builder")}
                sx={{ color: "secondary.main", fontWeight: 600 }}
              >
                <ListItemText primary="Create Prompt" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={toggleColorMode}>
                <ListItemText
                  primary={mode === "dark" ? "Light Mode" : "Dark Mode"}
                />
              </ListItemButton>
            </ListItem>
            {user && (
              <>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="body2" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email} • {user.role}
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigation("/login")}
              sx={{ color: "secondary.main", fontWeight: 600 }}
            >
              <ListItemText primary="Sign In" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {isMobile && isAuthenticated && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              fontWeight: 700,
            }}
            onClick={() => navigate("/")}
          >
            Promptify
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/")}
                    sx={{
                      fontWeight: isActive("/") ? 600 : 400,
                      textDecoration: isActive("/") ? "underline" : "none",
                    }}
                  >
                    Team Library
                  </Button>

                  <Button
                    color="inherit"
                    onClick={() => navigate("/my-library")}
                    sx={{
                      fontWeight: isActive("/my-library") ? 600 : 400,
                      textDecoration: isActive("/my-library")
                        ? "underline"
                        : "none",
                    }}
                  >
                    My Library
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate("/builder")}
                    sx={{
                      ml: 2,
                      fontWeight: 600,
                    }}
                  >
                    Create Prompt
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/login")}
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Button>
              )}

              <IconButton
                color="inherit"
                onClick={toggleColorMode}
                aria-label="toggle theme"
              >
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              {isAuthenticated && user && (
                <>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    color="inherit"
                  >
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem disabled>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email} • {user.role}
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
