import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import { refreshAuthToken } from "../store/auth.slice";
import Loader from "../components/AppItems/AppLoader";

const PersistLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const { accessToken, isLoading, isError, persist } = authState;

  useEffect(() => {
    if (!accessToken && persist) dispatch(refreshAuthToken());
  }, [accessToken, persist, dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  if (isLoading && !isError) return <Loader />;

  return <Outlet />;
};

export default PersistLogin;
