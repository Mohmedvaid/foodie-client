import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// UI Components
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import useTheme from "@mui/material/styles/useTheme";

import { login, togglePersist } from "../../store/auth.slice";
import AuthWrapper from "../../components/AuthWrapper";
import useNavigateTo from "../../hooks/useNavigateTo";
import AppForm from "../../components/AppItems/AppForm";

const Login = () => {
  const theme = useTheme(); // Access theme for responsive design
  const dispatch = useDispatch();
  const { persist } = useSelector((state) => state.auth);
  const navigateTo = useNavigateTo();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleTogglePersist = () => dispatch(togglePersist());

  const handleSubmit = async (e) => {
    console.log("Clicked");
    e.preventDefault();
    dispatch(login({ email, password }))
      .unwrap()
      .then((data) => navigateTo(data.isInitialLogin ? "/onboarding" : "/"))
      .catch((err) => {
        if (err.message) setErrMsg(err.message);
        else setErrMsg("Login Failed");
      });
  };

  const loginFields = [
    {
      id: "username",
      label: "Username",
      type: "text",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      required: true,
      autoComplete: "username",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      required: true,
      autoComplete: "current-password",
    },
  ];

  return (
    <AuthWrapper title="Welcome Back!" title2="Please sign in to continue">
      <AppForm
        fields={loginFields}
        handleSubmit={handleSubmit}
        submitButtonText="Sign In"
        errMsg={errMsg}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          marginTop: theme.spacing(2),
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              id="persist"
              checked={persist}
              onChange={handleTogglePersist}
            />
          }
          label="Trust this device"
        />
      </Box>
      <Box textAlign="center" sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ cursor: "pointer" }}>
          Forgot password?
        </Typography>
      </Box>
      <Divider>OR</Divider>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <IconButton aria-label="sign in with google">
          <GoogleIcon />
        </IconButton>
        <IconButton aria-label="sign in with facebook">
          <FacebookIcon />
        </IconButton>
      </Box>
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="body2">
          {"Don't have an account? "}
          <Typography
            variant="body2"
            component="span"
            sx={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigateTo("/signup")}
          >
            Sign Up
          </Typography>
        </Typography>
      </Box>
    </AuthWrapper>
  );
};

export default Login;
