import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import LoginPage from "../pages/public/LoginPage";
import SignupPage from "../pages/public/SignupPage";
import Unauthorized from "../pages/public/Unauthorized";
import HomePage from "../pages/protected/HomePage";

const menuItems = [
  { path: "/", label: "Home", icon: <HomeIcon /> },
  {
    path: "/upload",
    label: "",
    icon: <AddCircleIcon sx={{ fontSize: "2rem" }} />,
  },
  { path: "/profile", label: "Profile", icon: <AccountCircleIcon /> },
];

const noAuthPages = [
  { path: "/login", component: <LoginPage /> },
  { path: "/signup", component: <SignupPage /> },
  { path: "/unauthorized", component: <Unauthorized /> },
];

const authPages = [{ path: "/", component: <HomePage /> }];

export { menuItems, noAuthPages, authPages };
