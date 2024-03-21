// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "../components/AppItems/AppButton";
import { useNavigate } from "react-router-dom";

import MainContent from "../components/MainContent";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTabs from "../components/Profile/ProfileTabs";
import useLogout from "../hooks/useLogout";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const GET_USER_URL = "/user/";

const ProfilePage = () => {
  const logout = useLogout();
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const handleEdit = () => {
    navigate("/edit-profile");
  };
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(GET_USER_URL);
      setUserData(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [axios]);

  return (
    <MainContent>
      <Box sx={{ pb: 10 }}>
        <ProfileHeader user={userData} onEdit={handleEdit} />
        <ProfileTabs />
        <Button
          variant="contained"
          color="primary"
          onClick={logout}
          sx={{ position: "absolute", top: 16, right: 16 }}
        >
          Logout
        </Button>
      </Box>
    </MainContent>
  );
};

export default ProfilePage;
