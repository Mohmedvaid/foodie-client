// frontend/src/pages/UploadPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import Loader from "../components/AppItems/AppLoader";
import TextareaAutosize from "../components/AppItems/AppTextareaAutoSize";
import FileUploadButton from "../components/FileUploadButton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Button from "../components/AppItems/AppButton";
import MainContent from "../components/MainContent";
import permittedFormats from "../config/videoFormats";

const UPLOAD_URL = "/post/";
const CATEGORIES_URL = "/post/categories";

const UploadPage = () => {
  const axios = useAxiosPrivate();
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const extractTags = (description) => {
    const tagPattern = /#\w+/g;
    return description.match(tagPattern) || [];
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const fetchCategories = useCallback(async () => {
    const cachedCategories = localStorage.getItem("categories");
    if (cachedCategories) {
      setCategories(JSON.parse(cachedCategories));
    } else {
      try {
        const { data } = await axios.get(CATEGORIES_URL);
        setCategories(data.data);
        localStorage.setItem("categories", JSON.stringify(data.data));
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setErrMsg("Failed to fetch categories");
      }
    }
  }, [axios]); // Add any other dependencies if fetchCategories depends on them

  useEffect(() => {
    fetchCategories();
    return () => {
      setCategories([]);
    };
  }, [fetchCategories]);

  const validateInputs = useCallback(() => {
    if (!description.trim()) return "Description is required.";
    if (!videoFile) return "A video file is required.";
    if (!permittedFormats.includes(videoFile.type))
      return `Unsupported video format. Supported formats are: ${permittedFormats.join(
        ", "
      )}.`;
    if (!selectedCategory) return "Category selection is required.";
    return null;
  }, [description, videoFile, selectedCategory]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const errorMessage = validateInputs();
    if (errorMessage) {
      setSuccessMsg("");
      setErrMsg(errorMessage);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    const tags = extractTags(description);
    formData.append("tags", JSON.stringify(tags));
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("category", selectedCategory);

    try {
      const { status, data } = await axios.post(UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (status === 201) {
        setDescription("");
        setVideoFile(null);
        setSelectedCategory(null);
        setErrMsg("");
        setSuccessMsg(data.message);
      } else {
        setSuccessMsg("");
        setErrMsg(data?.message || "Upload Failed");
      }
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.message || "Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContent>
      <Container
        component={Paper}
        elevation={3}
        sx={{ padding: 3, maxWidth: 600, my: 3 }}
      >
        <Typography variant="h4" gutterBottom>
          Upload Video
        </Typography>
        {errMsg && <Alert severity="error">{errMsg}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}
        {loading && <Loader />}

        <Box component="form" onSubmit={handleUpload}>
          {/*  Description */}
          <FormControl variant="outlined" fullWidth margin="normal">
            {/* <InputLabel htmlFor="description">Description</InputLabel> */}
            <TextareaAutosize
              id="description"
              aria-label="Description"
              minRows={3}
              maxRows={10}
              style={{ width: "100%" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your video description and #tags (max 2200 characters)"
              tagSnapping
            />
          </FormControl>

          {/* Category select */}
          <FormControl fullWidth margin="normal">
            <Autocomplete
              id="category-select"
              options={categories}
              value={selectedCategory}
              onFocus={fetchCategories} // Trigger lazy loading on focus
              onChange={(event, newValue) => {
                setSelectedCategory(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  placeholder="Choose a category"
                />
              )}
            />
          </FormControl>

          {/* File upload */}
          <FormControl margin="normal">
            <FileUploadButton
              btnText="Upload Video"
              onFileSelect={handleFileSelect}
              acceptTypes="video/*"
              fileName={videoFile?.name}
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </MainContent>
  );
};

export default UploadPage;
