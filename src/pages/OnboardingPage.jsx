import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "../components/AppItems/AppButton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useNavigateTo from "../hooks/useNavigateTo";
import Loader from "../components/AppItems/AppLoader";
import useFetchCategories from "../hooks/useFetchCategories";

const styles = {
  boxContainer: {
    padding: 3,
    maxWidth: "100%",
    my: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    m: 3,
    width: "100%",
  },
  formGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 2,
  },
  submitButton: {
    mx: 3,
  },
  retryButton: {
    mt: 2,
  },
};

const OnboardingPage = () => {
  const { categories, loading, error, fetchCategories } = useFetchCategories();

  const navigateTo = useNavigateTo();
  const axios = useAxiosPrivate();

  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectionError, setSelectionError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryChange = (event) => {
    setSelectedCategories({
      ...selectedCategories,
      [event.target.name]: event.target.checked,
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selected = Object.keys(selectedCategories).filter(
      (key) => selectedCategories[key]
    );

    if (selected.length <= 0)
      return setSelectionError("Please select at 1 or more categories");

    setSelectionError("");

    try {
      const res = await axios.put("/user", { categories: selected });
      if (res.status === 200) navigateTo("/");
      else setSelectionError("Failed to update interests");
    } catch (error) {
      const status = error?.response?.data?.error;
      const message = error?.response?.data?.message;
      if (status && message) {
        return setSelectionError(message);
      }
      setSelectionError("Failed to update interests");
    }
  };

  const handleRetry = () => fetchCategories();

  return (
    <Container elevation={3} sx={styles.boxContainer}>
      <Typography variant="h4" gutterBottom>
        Aloha! Select your categories of interest
      </Typography>

      {loading ? (
        <Loader />
      ) : categories.length > 0 ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <FormControl
            component="fieldset"
            sx={styles.formControl}
            variant="standard"
          >
            <FormLabel component="legend">Categories</FormLabel>
            <FormGroup sx={styles.formGroup}>
              {categories.map((category) => (
                <FormControlLabel
                  key={category}
                  control={
                    <Checkbox
                      checked={selectedCategories[category] || false}
                      onChange={handleCategoryChange}
                      name={category}
                    />
                  }
                  label={capitalizeFirstLetter(category)}
                />
              ))}
            </FormGroup>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={styles.submitButton}
          >
            Complete Onboarding
          </Button>
          {selectionError && (
            <Typography variant="body2" color="error">
              {selectionError}
            </Typography>
          )}
        </Box>
      ) : error ? (
        <>
          <Typography color="error">{error}</Typography>
          <Button
            onClick={handleRetry}
            variant="outlined"
            sx={styles.retryButton}
          >
            Retry
          </Button>
        </>
      ) : (
        <Typography>No categories available at the moment.</Typography>
      )}
    </Container>
  );
};

export default OnboardingPage;
