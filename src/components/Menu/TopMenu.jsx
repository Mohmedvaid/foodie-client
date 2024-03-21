import React from "react";
import { Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LightLogo, DarkLogo } from "../../assets/";
import Button from "../AppItems/AppButton";

const TopMenu = () => {
  const theme = useTheme();
  const location = useLocation();
  const matches = useMediaQuery(theme.breakpoints.up("sm")); // Hides the button on smaller screens
  const isDarkMode = theme.palette.mode === "dark";
  const logo = isDarkMode ? DarkLogo : LightLogo;
  const buttonLabel = location.pathname === "/login" ? "Sign Up" : "Sign In";
  const buttonPath = location.pathname === "/login" ? "/signup" : "/login";

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Box
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img src={logo} alt="Logo" style={{ height: 35 }} />
        </Box>

        <Button
          variant="outlined"
          component={Link}
          to={buttonPath}
          size="small"
        >
          {buttonLabel}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;
