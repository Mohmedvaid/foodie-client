import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { signup } from "../../store/authSlice";
import useNavigateTo from "../../hooks/useNavigateTo";
import AppForm from "../../components/AppItems/AppForm";
import AuthWrapper from "../../components/AuthWrapper";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigateTo();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = pwd === matchPwd;
    if (!v1) return setErrMsg("Invalid Username");
    if (!v2) return setErrMsg("Invalid Password");
    if (!v3) return setErrMsg("Invalid Email");
    if (!v4) return setErrMsg("Passwords do not match");

    if (!v1 || !v2 || !v3 || !v4) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      await dispatch(signup({ username: user, password: pwd, email }))
        .unwrap()
        .then((data) => {
          navigateTo("/onboarding");
        });
    } catch (err) {
      if (err?.message) {
        setErrMsg(err.message);
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
    }
  };

  const signupFields = [
    {
      id: "username",
      label: "Username",
      type: "text",
      value: user,
      onChange: (e) => setUser(e.target.value),
      required: true,
      autoComplete: "username",
      helperText: "4 to 24 characters. Must begin with a letter.",
      validation: USER_REGEX,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      required: true,
      autoComplete: "email",
      helperText: "Must be a valid email address.",
      validation: EMAIL_REGEX,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      value: pwd,
      onChange: (e) => setPwd(e.target.value),
      required: true,
      autoComplete: "new-password",
      helperText:
        "8 to 24 characters. Must include uppercase and lowercase letters, a number, and a special character.",
      validation: PWD_REGEX,
    },
    {
      id: "confirm_pwd",
      label: "Confirm Password",
      type: "password",
      value: matchPwd,
      onChange: (e) => setMatchPwd(e.target.value),
      required: true,
      helperText: "Must match the first password input field.",
      validation: (value) => value === pwd,
    },
  ];

  return (
    <AuthWrapper title="Sign Up" title2="Create your account">
      <AppForm
        title="Sign Up"
        fields={signupFields}
        handleSubmit={handleSubmit}
        submitButtonText="Sign Up"
        errMsg={errMsg}
      />
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="body2">
          Already registered?{" "}
          <Typography
            variant="body2"
            component="span"
            sx={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigateTo("/login")}
          >
            Login
          </Typography>
        </Typography>
      </Box>
    </AuthWrapper>
  );
};

export default SignupPage;
