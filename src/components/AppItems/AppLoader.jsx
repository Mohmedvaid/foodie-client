import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

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

// dont use objects for prop types
Loader.propTypes = {
  center: PropTypes.bool,
  sx: PropTypes.object,
};

Loader.defaultProps = {
  center: true,
  sx: {},
};

export default Loader;
