// frontend/src/index.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";
import App from "./App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// NOTE: strict mode makes double requests should not happen in prod build
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
