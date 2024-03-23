// frontend/src/hooks/useNavigateTo.js
import { useNavigate, useLocation } from "react-router-dom";

const useNavigateTo = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (
    path,
    options = { replace: true },
    ignoreFrom = false,
  ) => {
    const from = location.state?.from?.pathname;
    if (from && !ignoreFrom) {
      navigate(from, options);
    } else {
      navigate(path, options);
    }
  };

  return navigateTo;
};

export default useNavigateTo;
