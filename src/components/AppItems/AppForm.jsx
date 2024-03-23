import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import PropTypes from "prop-types";
import AppButton from "./AppButton";

const AppForm = ({ fields, handleSubmit, submitButtonText, errMsg }) => {
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (fieldId) => {
    setFocusedField(fieldId);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      {fields.map((field, index) => (
        <FormControl
          variant="outlined"
          fullWidth
          margin="normal"
          key={field.id}
        >
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
            autoFocus={index === 0}
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
        onClick={handleClick}
      >
        {submitButtonText}
      </AppButton>
    </Box>
  );
};

AppForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      required: PropTypes.bool,
      disabled: PropTypes.bool,
      autoComplete: PropTypes.string,
      startAdornment: PropTypes.node,
      endAdornment: PropTypes.node,
      helperText: PropTypes.string,
    })
  ).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  errMsg: PropTypes.string,
};

AppForm.defaultProps = {
  errMsg: "",
};

export default AppForm;
