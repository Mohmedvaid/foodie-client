import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const AuthContainer = ({ title, title2, children }) => (
  <Box>
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 2,
      }}
    >
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <Typography variant="h5">{title}</Typography>
        {title2 && <Typography variant="body1">{title2}</Typography>}
      </Box>
      {children}
    </Container>
  </Box>
);

AuthContainer.defaultProps = {
  title2: "", // title2 is optional and defaults to an empty string
};

AuthContainer.propTypes = {
  title: PropTypes.string.isRequired, // title is required and must be a string
  title2: PropTypes.string, // title2 is optional and must be a string
  children: PropTypes.node.isRequired, // children is required and can be any renderable React content
};

export default AuthContainer;
