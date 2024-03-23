// frontend/src/pages/HomePage.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/auth.slice";

const HomePage = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout())
      .unwrap()
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl">Home</h1>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
