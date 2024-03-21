// frontend/src/hooks/useAxiosPrivate.jsx
import { axiosPrivate } from "../config/axios";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { refreshAuthToken } from "../store/authSlice";

const useAxiosPrivate = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await dispatch(refreshAuthToken()).unwrap();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, dispatch]);

  return axiosPrivate;
};

export default useAxiosPrivate;
