import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

const styles = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 100,
  },
};

const Loader = ({ center = true, sx }) => {
  const combinedStyles = center ? { ...styles.container, ...sx } : sx;

  return (
    <Box sx={combinedStyles}>
      <CircularProgress size={50} color="secondary" />
    </Box>
  );
};

export default Loader;
