import React from "react";
import { Alert } from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

interface UnBlockGuideProps {
  tip: string;
}

const UnBlockGuide: React.FC<UnBlockGuideProps> = ({ tip }) => {
  return (
    <Alert
      severity="info"
      icon={<LightbulbOutlinedIcon />}
      sx={{
        mb: 3,
        "& .MuiAlert-message": {
          width: "100%",
        },
      }}
    >
      {tip}
    </Alert>
  );
};

export default UnBlockGuide;
