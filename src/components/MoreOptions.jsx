// frontend/src/components/MoreOptions.jsx
import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const MoreOptions = ({ options }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more options"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem
            key={option.text}
            onClick={() => {
              window.location.href = option.link;
              handleClose();
            }}
          >
            {option.text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MoreOptions;
