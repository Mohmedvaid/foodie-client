import React, { lazy } from "react";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import OnboardingPage from "../pages/OnboardingPage";
import Unauthorized from "../pages/auth/Unauthorized";
import HomePage from "../pages/HomePage";

const UploadPage = lazy(() => import("../pages/UploadPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const EditProfilePage = lazy(() => import("../pages/EditProfilePage"));
const CreatorPage = lazy(() => import("../pages/CreatorPage"));
const TestPage = lazy(() => import("../pages/TestPage"));

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

const authPages = [
  { path: "/", component: <HomePage /> },
  { path: "/onboarding", component: <OnboardingPage />, showMenu: false },
  { path: "/upload", component: <UploadPage /> },
  { path: "/profile", component: <ProfilePage /> },
  { path: "/edit-profile", component: <EditProfilePage /> },
  { path: "/profile/:username", component: <CreatorPage /> },
  { path: "/video/:id", component: <TestPage /> },
];

export { menuItems, noAuthPages, authPages };
