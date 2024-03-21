import axios from "axios";
import { store } from "../store/store";
import { refreshAuthToken } from "../store/authSlice";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default axios.create({
  baseURL: BASE_URL,
});

const setAuthHeader = (config) => {
  const state = store.getState();
  const accessToken = state.auth.accessToken;
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
};

const handleAuthError = async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const newAccessToken = await store.dispatch(refreshAuthToken()).unwrap();
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axiosPrivate(originalRequest);
    } catch (_error) {
      return Promise.reject(_error);
    }
  }
  return Promise.reject(error);
};

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(setAuthHeader, (error) =>
  Promise.reject(error)
);
axiosPrivate.interceptors.response.use((response) => response, handleAuthError);

export const axiosPrivateForFiles = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosPrivateForFiles.interceptors.request.use(setAuthHeader, (error) =>
  Promise.reject(error)
);
axiosPrivateForFiles.interceptors.response.use(
  (response) => response,
  handleAuthError
);
