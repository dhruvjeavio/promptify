import React from "react";
import { Box, Typography, Container } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Promptify. Built for collaborative AI
            prompt development.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {/* Made with ❤️ for hackathons */}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
