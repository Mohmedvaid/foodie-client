// frontend/src/components/Profile/ProfileTabs.jsx
import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import VideoList from "./VideoList"; // Component that you'll create for videos
import LikedVideos from "./LikedVideos"; // Component that you'll create for liked videos

const ProfileTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Videos" />
        <Tab label="Likes" />
      </Tabs>
      {tabIndex === 0 ? <VideoList /> : <LikedVideos />}
    </Box>
  );
};

export default ProfileTabs;
