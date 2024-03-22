import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const AuthContainer = ({ title, title2, children }) => {
  return (
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
};

export default AuthContainer;
