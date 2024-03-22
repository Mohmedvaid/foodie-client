// frontend/src/pages/HomePage.jsx
import React from "react";
import { useSelector } from "react-redux";

const HomePage = () => {
  const authState = useSelector((state) => state.auth);
  console.log("HomePage -> authState", authState);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl">Home</h1>
    </div>
  );
};

export default HomePage;
