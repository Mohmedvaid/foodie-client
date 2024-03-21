import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./AppItems/AppButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const PostDetails = ({ username, postContent }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const navigate = useNavigate();

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  const navigateToProfile = () => {
    navigate(`/profile/${username}`); // Navigate to the user's profile page
  };

  const displayContent = showFullContent
    ? postContent
    : `${postContent.substring(0, 100)}...`;

  return (
    <Box>
      <Button
        onClick={navigateToProfile}
        sx={{ p: "3px", fontWeight: "bold" }}
        variant="text"
      >
        {username}
      </Button>
      {/* TODO */}
      <Button variant="outlined" size="small" sx={{ p: 0 }}>
        Follow
      </Button>
      <Typography variant="body2">
        {displayContent}
        <Button
          size="small"
          onClick={toggleContent}
          variant="text"
          sx={{
            color: "rgb(51, 163, 255)",
            py: 0,
          }}
          key={postContent}
        >
          {showFullContent ? "Less" : "More"}
        </Button>
      </Typography>
    </Box>
  );
};

export default PostDetails;
