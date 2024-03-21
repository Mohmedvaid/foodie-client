// frontend/src/components/MainContent.jsx
import React from "react";
import { Box } from "@mui/material";

const MainContent = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 56px)",
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
};

export default MainContent;
