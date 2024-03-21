// Import necessary components
import React, { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const styles = {
  paper: { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1 },
};

const BottomMenu = forwardRef(({ menuItems, value }, ref) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false); // State to toggle menu visibility

  const handleChange = (event, newValue) => navigate(newValue);
  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <>
      <IconButton
        aria-label="open menu"
        sx={{ position: "fixed", bottom: 75, right: 18, zIndex: 1 }} // Adjust positioning as needed
        onClick={toggleMenu}
      >
        {showMenu ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      {showMenu && ( // Render the BottomNavigation only if showMenu is true
        <Paper ref={ref} sx={styles.paper} elevation={3}>
          <BottomNavigation showLabels value={value} onChange={handleChange}>
            {menuItems.map((item, index) => (
              <BottomNavigationAction
                key={index}
                label={item.label}
                value={item.path}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </>
  );
});

export default BottomMenu;
