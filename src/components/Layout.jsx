// src/components/Layout.jsx
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes
import Box from "@mui/material/Box";

const Layout = ({ children }) => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </Box>
);

// Define prop types for the Layout component
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
