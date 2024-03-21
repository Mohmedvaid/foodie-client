import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const LikeButton = ({ likeCount, postId, isLikedByUser }) => {
  const [liked, setLiked] = useState(isLikedByUser);
  const axios = useAxiosPrivate();

  // Update the liked state when the isLikedByUser prop changes
  useEffect(() => {
    setLiked(isLikedByUser);
  }, [isLikedByUser]);

  const toggleLike = async () => {
    try {
      // Toggle the like state optimistically
      setLiked(!liked);

      // Call the backend to toggle the like status
      const response = await axios.post("/interaction/like", {
        postId,
      });

      // Update the like count based on the response if necessary
      // If your backend sends back the new like count, you can use it here
      console.log("Like interaction response:", response.data);
    } catch (err) {
      console.error("Error toggling like interaction:", err);
      // Revert the like state if the request fails
      setLiked(liked);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {likeCount > 10 && <Typography>{likeCount}</Typography>}
      <IconButton onClick={toggleLike}>
        {liked ? <FavoriteIcon color="secondary" /> : <FavoriteBorderIcon />}
      </IconButton>
    </Box>
  );
};

export default LikeButton;
