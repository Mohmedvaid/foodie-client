// frontend/src/hooks/useRefreshToken.jsx
import { useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";
import axios from "../config/axios";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
      const data = response.data.data;
      dispatch(
        login({
          user: data.userData,
          accessToken: data.accessToken,
          role: data.role,
        })
      );
      return data.accessToken;
    } catch (err) {
      dispatch(logout());
    }
  };
  return refresh;
};

export default useRefreshToken;
