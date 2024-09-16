import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface PrivateRouteProps {
  role: number | number[];
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role, children }) => {
  const { user, author } = useUser();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // useEffect(() => {
  //   if (!user) {
  //     localStorage.removeItem("user");
  //     localStorage.removeItem("author");
  //     const navigate = useNavigate();
  //     navigate("/login");
  //   }
  // }, [user]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (
    user.role_id === 2 &&
    !author?.is_verified &&
    location.pathname !== "/author/profile/edit"
  ) {
    return <Navigate to="/author/profile/edit" />;
  }

  if (Array.isArray(role)) {
    if (!role.includes(user.role_id)) {
      return <Navigate to="/unauthorized" />;
    }
  } else if (user.role_id !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;
