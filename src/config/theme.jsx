// src/config/theme.js
import { createTheme } from "@mui/material/styles";

const light = {
  primary: {
    main: "#3d3d3d",
  },
  loaderColor: "#3d3d3d",
  appBar: "#ffffff", // White to match the background
  appBarElevation: "rgba(0, 0, 0, 0.12)", // Matching the paper elements
};

const dark = {
  primary: {
    main: "#6B6B6B",
  },
  loaderColor: "#ffffff",
  appBar: "#212121", // Matching the paper elements
  appBarElevation: "rgba(255, 255, 255, 0.12)", // Matching the paper elements
};

const sharedStyles = {
  primary: {
    main: "#3d3d3d",
  },
  secondary: {
    main: "#f86772",
  },
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  headerFontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif', // Font for headers
  borderRadius: 8, // Example of a shared style value
};

const createAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? dark.primary.main : light.primary.main,
      },
      secondary: {
        main: sharedStyles.secondary.main,
      },
      loaderColor: mode === "dark" ? dark.loaderColor : light.loaderColor,
    },
    typography: {
      fontFamily: sharedStyles.fontFamily,
      h1: {
        fontFamily: sharedStyles.headerFontFamily,
        fontSize: "2.2rem",
        fontWeight: 500,
      },
      h2: {
        fontFamily: sharedStyles.headerFontFamily,
        fontSize: "2rem",
        fontWeight: 500,
      },
      body1: {
        fontSize: "1rem",
      },
      button: {
        textTransform: "none",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: sharedStyles.borderRadius,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.mode === "light" && light.appBar,
            boxShadow: `0px 2px 4px -1px ${
              theme.palette.mode === "dark"
                ? dark.appBarElevation
                : light.appBarElevation
            }`,
          }),
        },
      },
    },
  });

export default createAppTheme;
