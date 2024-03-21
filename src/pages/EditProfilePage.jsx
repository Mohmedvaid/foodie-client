// frontend/src/pages/EditProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../store/authSlice";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import Avatar from "@mui/material/Avatar";
import Button from "../components/AppItems/AppButton";

import FileUploadButton from "../components/FileUploadButton";
import MainContent from "../components/MainContent";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, errorMessage } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const userData = user;
    setFirstName(userData?.firstName || "");
    setLastName(userData?.lastName || "");
    setUsername(userData?.username || "");
    setEmail(userData?.email || "");
    setBio(userData?.bio || "");
    if (userData?.profilePicture) {
      setImagePreview(userData.profilePicture);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match("image.*")) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add logic to call API for profile update
      setErrMsg("");
      setSuccessMsg("");

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("bio", bio);

      if (image) {
        formData.append("profilePicture", image);
      }

      dispatch(updateUser(formData))
        .unwrap()
        .then((data) => {
          console.log(data);
        });
      setSuccessMsg("Profile updated successfully");
    } catch (err) {
      setErrMsg("Failed to update profile");
      setSuccessMsg("");
      console.error(err);
    }
  };

  useEffect(() => {
    if (isError) {
      setErrMsg(errorMessage);
    }
  }, [isError, errorMessage]);

  // back to previous page
  const handleBack = () => navigate(-1);

  return (
    <MainContent>
      <Container
        component={Paper}
        elevation={3}
        sx={{ padding: 3, maxWidth: 600, paddingBottom: 15 }}
      >
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>
        {errMsg && (
          <Typography variant="body2" color="error">
            {errMsg}
          </Typography>
        )}
        {successMsg && (
          <Typography variant="body2" color="success">
            {successMsg}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          {/* profile picture */}
          {/* Display Image Preview with Avatar */}
          <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
            <Avatar
              src={imagePreview}
              alt="Profile Preview"
              sx={{ width: 128, height: 128 }}
              variant="rounded" // You can change the variant if needed
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <FileUploadButton
              btnText={
                user?.profilePicture
                  ? "Change Profile Picture"
                  : "Upload Profile Picture"
              }
              onFileSelect={handleImageChange}
              acceptTypes="image/*"
            />
          </Box>

          {/* Form fields for first name, last name, and bio */}
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="first-name">First Name</InputLabel>
            <OutlinedInput
              id="first-name"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </FormControl>
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="last-name">Last Name</InputLabel>
            <OutlinedInput
              id="last-name"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </FormControl>
          {/* username diabled and add a note to user that you cannot change this */}

          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="username">Username</InputLabel>
            <OutlinedInput
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled
            />
            <FormHelperText>
              You cannot change your username once you have created your
              account.
            </FormHelperText>
          </FormControl>
          {/* email */}
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel htmlFor="bio">Bio</InputLabel>
            <OutlinedInput
              id="bio"
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              multiline
              rows={4}
            />
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
          {/* back button */}
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleBack}
          >
            Back
          </Button>
        </Box>
      </Container>
    </MainContent>
  );
};

export default EditProfilePage;
