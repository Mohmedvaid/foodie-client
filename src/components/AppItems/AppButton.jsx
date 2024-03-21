import React from "react";
import Button from "@mui/material/Button";

const AppButton = ({ children, sx, size = "medium", ...props }) => {
  return (
    <Button
      {...props}
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
};

export default AppButton;
