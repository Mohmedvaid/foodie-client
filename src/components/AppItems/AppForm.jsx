import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import AppButton from "./AppButton";

const AppForm = ({ fields, handleSubmit, submitButtonText, errMsg }) => {
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (fieldId) => {
    setFocusedField(fieldId);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {fields.map((field, index) => (
        <FormControl variant="outlined" fullWidth margin="normal" key={index}>
          <InputLabel htmlFor={field.id}>{field.label}</InputLabel>
          <OutlinedInput
            id={field.id}
            label={field.label}
            type={field.type || "text"}
            value={field.value}
            onChange={field.onChange}
            onFocus={() => handleFocus(field.id)}
            onBlur={handleBlur}
            required={field.required}
            disabled={field.disabled}
            autoComplete={field.autoComplete}
            startAdornment={field.startAdornment}
            endAdornment={field.endAdornment}
            autoFocus={index === 0} // Automatically focus the first input field
          />
          {focusedField === field.id && field.helperText && (
            <Typography variant="caption" sx={{ mt: 1 }}>
              {field.helperText}
            </Typography>
          )}
        </FormControl>
      ))}
      {errMsg && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {errMsg}
        </Typography>
      )}
      <AppButton
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        {submitButtonText}
      </AppButton>
    </Box>
  );
};

export default AppForm;
