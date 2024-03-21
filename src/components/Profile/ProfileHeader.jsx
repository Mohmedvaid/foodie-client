// frontend/src/components/Profile/ProfileHeader.jsx
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "../AppItems/AppButton";
import Avatar from "@mui/material/Avatar";

const ProfileHeader = ({ user, onEdit }) => {
  // Placeholder user data - replace this with actual user data
  if (!user) return <div>Loading...</div>;
  const { username, following, followers, profilePicture, bio } = user;
  const totalFollowers = followers.length;
  const totalFollowing = following.length;
  const userBio = bio || "No bio added";
  const profilePicUrl = profilePicture; //|| "https://i.pravatar.cc/300";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      {/* if no profile pic the use avatar else show the pic */}
      {profilePicUrl ? (
        <Avatar
          alt={username}
          src={profilePicUrl}
          sx={{ width: 128, height: 128, my: 2 }}
        />
      ) : (
        <Avatar alt={username} sx={{ width: 128, height: 128, my: 2 }} />
      )}
      {/* Replace with user's thumbnail */}
      <Typography variant="h6">@{username}</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          my: 2,
        }}
      >
        <Typography>{totalFollowing} Following</Typography>
        <Typography>{totalFollowers} Followers</Typography>
        {/* <Typography>{likes} Likes</Typography> */}
      </Box>
      <Typography variant="body1">{userBio}</Typography>
      <Button variant="outlined" sx={{ my: 2 }} onClick={onEdit}>
        Edit Profile
      </Button>
    </Box>
  );
};

export default ProfileHeader;
