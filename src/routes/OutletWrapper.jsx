// frontend/src/routes/OutletWrapper.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <main className="App">
    <Outlet />
  </main>
);

export default Layout;
