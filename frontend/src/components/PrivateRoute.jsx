import React from "react";
import { useUser } from "../context/UserContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ role, children }) => {
    const { user, author } = useUser();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    if (
        user &&
        (location.pathname === "/login" || location.pathname === "/register")
    ) {
        if (user.role_id === 3) {
            return <Navigate to="/admin" />;
        } else if (user.role_id === 2) {
            return <Navigate to="/author/profile/edit" />;
        } else if (user.role_id === 1) {
            return <Navigate to="/" />;
        }
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (
        user.role_id === 2 &&
        !author.is_verified &&
        location.pathname !== "/author/profile/edit"
    ) {
        alert("Your Profile is not Verified.");
        return <Navigate to="/author/profile/edit" />;
    }

    if (Array.isArray(role)) {
        if (!role.includes(user.role_id)) {
            return <Navigate to="/unauthorized" />;
        }
    } else if (user.role_id !== role) {
        return <Navigate to="/unauthorized" />;
    }

    return children ? children : <Outlet />;
};

export default PrivateRoute;
