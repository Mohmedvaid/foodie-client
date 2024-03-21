import React from "react";
import TextField from "@mui/material/TextField";

const CustomTextArea = ({
  id = "custom-text-area",
  value,
  onChange,
  minRows,
  maxRows,
  placeholder,
}) => {
  return (
    <TextField
      id={id}
      placeholder={placeholder}
      multiline
      minRows={minRows}
      maxRows={maxRows}
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
      inputProps={{ maxLength: 2200 }} // set maximum character length
      // Add any additional styles or props you need
    />
  );
};

export default CustomTextArea;
