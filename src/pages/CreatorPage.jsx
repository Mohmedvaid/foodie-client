// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";

import MainContent from "../components/MainContent";
import ProfileHeader from "../components/Creator/ProfileHeader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import VideoList from "../components/Creator/VideoList";
const GET_USER_URL = "/user/";

const CreatorPage = () => {
  const { username } = useParams();
  const currentUser = useSelector((state) => state.auth.user._id);

  const axios = useAxiosPrivate();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${GET_USER_URL}${username}/`);
      setUserData(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkFollowing = () => {
    if (!userData) return;
    const creatorFollowers = userData.followers;
    const isFollowing = creatorFollowers.includes(currentUser);
    console.log("isFollowing", isFollowing);
    setIsFollowing(isFollowing);
  };

  const toggleFollow = async () => {
    const followUrl = `/user/${userData._id}/follow`;
    const unfollowUrl = `/user/${userData._id}/unfollow`;
    const url = isFollowing ? unfollowUrl : followUrl;

    try {
      await axios.post(url);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [axios]);

  useEffect(() => {
    checkFollowing();
  }, [userData]);

  return (
    <MainContent>
      <Box sx={{ pb: 10 }}>
        <ProfileHeader
          user={userData}
          isFollowing={isFollowing}
          onToggleFollow={toggleFollow}
        />
        <VideoList username={username} />
      </Box>
    </MainContent>
  );
};

export default CreatorPage;
