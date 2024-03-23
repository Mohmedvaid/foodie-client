// src/components/AppItems/AppButton.jsx
import React from "react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

// eslint-disable-next-line react/jsx-props-no-spreading
const AppButton = ({ children, sx, size, type }) => (
  <Button
    type={type}
    size={size}
    sx={{
      textTransform: "none",
      borderRadius: "20px",
      padding: "6px 12px",
      ...sx,
    }}
  >
    {children}
  </Button>
);

AppButton.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  type: PropTypes.string,
};

AppButton.defaultProps = {
  sx: {},
  size: "medium",
  type: "button",
};

export default AppButton;
