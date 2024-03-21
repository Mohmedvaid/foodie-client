// frontend/src/hooks/useLogout.jsx
import axios from "../config/axios";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const useLogout = () => {
  const dispatch = useDispatch();

  const logoutUser = async () => {
    try {
      await axios("/auth/logout", {
        withCredentials: true,
      });
      dispatch(logout());
    } catch (err) {
      console.error(err);
    }
  };

  return logoutUser;
};

export default useLogout;
