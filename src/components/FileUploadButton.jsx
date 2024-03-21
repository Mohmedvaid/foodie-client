import React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Button from "./AppItems/AppButton";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const FileUploadButton = ({
  btnText = "Upload",
  onFileSelect,
  acceptTypes,
  fileName = "",
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginY: 3 }}>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        {btnText}
        <VisuallyHiddenInput
          type="file"
          onChange={onFileSelect}
          accept={acceptTypes}
        />
      </Button>
      {fileName && (
        <Typography variant="body2" sx={{ flexGrow: 1, textAlign: "right" }}>
          {fileName}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploadButton;
