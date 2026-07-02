import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
export const PublicRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  console.log(user)
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (user) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Outlet />;
  }
};
export const ProtectedRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  console.log(user)
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (user) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};
