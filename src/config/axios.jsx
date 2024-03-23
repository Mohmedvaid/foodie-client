// src/config/axios.jsx
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Standard axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Axios instance for private API calls
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Axios instance specifically for file transfers
export const axiosPrivateForFiles = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const setupInterceptors = (store, { refreshAuthToken }) => {
  const setAuthHeader = (config) => {
    const newConfig = config;
    const state = store.getState();
    const { accessToken } = state.auth;
    if (accessToken) {
      newConfig.headers.Authorization = `Bearer ${accessToken}`;
    }
    return newConfig;
  };

  const handleAuthError = async (error) => {
    const originalRequest = error.config;
    // eslint-disable-next-line no-underscore-dangle
    if (error.response?.status === 403 && !originalRequest._retry) {
      // eslint-disable-next-line no-underscore-dangle
      originalRequest._retry = true;
      try {
        const newAccessToken = await store
          .dispatch(refreshAuthToken())
          .unwrap();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosPrivate(originalRequest);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  };

  axiosPrivate.interceptors.request.use(setAuthHeader, (error) =>
    Promise.reject(error)
  );
  axiosPrivate.interceptors.response.use(
    (response) => response,
    handleAuthError
  );
  axiosPrivateForFiles.interceptors.request.use(setAuthHeader, (error) =>
    Promise.reject(error)
  );
  axiosPrivateForFiles.interceptors.response.use(
    (response) => response,
    handleAuthError
  );
};
