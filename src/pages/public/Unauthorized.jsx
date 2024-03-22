// frontend/src/pages/Unauthorized.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "../../components/AppItems/AppButton";

const Unauthorized = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000); // Redirect to login after 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Typography variant="h1" gutterBottom>
          401
        </Typography>
        <Typography variant="h4" gutterBottom>
          Unauthorized
        </Typography>
        <Typography variant="body1" paragraph>
          You will be redirected to the login page in 5 seconds.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
        >
          Go to Login Now
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;
