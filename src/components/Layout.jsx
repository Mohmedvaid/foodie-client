// frontend/src/components/Layout.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Menu from "./Menu/BottomMenu";

const Layout = ({ children, menuItems, showMenu = true }) => {
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
      {showMenu && <Menu menuItems={menuItems} value={value} />}
    </>
  );
};

export default Layout;
