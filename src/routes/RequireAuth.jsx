import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import Loader from "../components/AppItems/AppLoader";

const RequireAuth = () => {
  const { accessToken, isLoading, isError, persist } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (isLoading || (persist && !accessToken)) return <Loader />;

  if (isError || !accessToken)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
};

export default RequireAuth;
