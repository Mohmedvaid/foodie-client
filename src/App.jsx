// frontend/src/App.jsx
import React, { useMemo, Suspense } from "react";
import { Provider } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import useSystemTheme from "./hooks/useSystemTheme";
import { store } from "./store/store";
import createTheme from "./config/theme";
import Layout from "./components/Layout";
import Loader from "./components/AppItems/AppLoader";
import OutletWrapper from "./routes/OutletWrapper";
import PersistLogin from "./routes/PersistentLogin";
import RequireAuth from "./routes/RequireAuth";
const Missing = React.lazy(() => import("./pages/Missing"));

const { menuItems, noAuthPages, authPages } = require("./config/pages");

const App = () => {
  const systemTheme = useSystemTheme();
  const theme = useMemo(() => createTheme(systemTheme), [systemTheme]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<OutletWrapper />}>
              {/* public routes */}
              {noAuthPages.map(({ path, component }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Layout menuItems={menuItems} showMenu={false}>
                      {component}
                    </Layout>
                  }
                />
              ))}

              <Route element={<PersistLogin />}>
                <Route element={<RequireAuth />}>
                  {/* private routes */}
                  {authPages.map(({ path, component, showMenu = true }) => (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <Layout menuItems={menuItems} showMenu={showMenu}>
                          {component}
                        </Layout>
                      }
                    />
                  ))}
                </Route>
              </Route>

              {/* catch all */}
              <Route path="*" element={<Missing />} />
            </Route>
          </Routes>
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
