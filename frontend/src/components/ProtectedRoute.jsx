import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  user,
  requiredRole,
  redirectPath = "/login",
  children,
}) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  if (requiredRole === "user" && user.role !== "user") {
    return <Navigate to={redirectPath} replace />;
  }
  if (requiredRole === "admin" && user.role !== "admin") {
    return <Navigate to={redirectPath} replace />;
  }
  if (requiredRole === "driver" && user.role !== "driver") {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
