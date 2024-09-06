import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import HandleNotificationClick from "./handleNotificationClick";
import { useUser } from "../context/UserContext";
import { logout } from "../api/api";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, setAuthor } = useUser();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user?.role_id === 2) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get("/api/notifications");
          setNotifications(response.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAuthor(null);
    localStorage.removeItem("user");
    localStorage.removeItem("author");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand">Bookflix</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && user.role_id === 1 && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/library"
                  >
                    Library
                  </Link>
                </li>
              </>
            )}

            {user && user.role_id === 3 && (
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/admin"
                >
                  Admin Panel
                </Link>
              </li>
            )}

            {user && user.role_id === 2 && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/author/publications"
                  >
                    My Publications
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/author/publish"
                  >
                    Publish
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/author/profile/edit"
                  >
                    Edit Profile
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {user && user.role_id === 2 && (
                <li className="nav-item">
                  <HandleNotificationClick
                    className="border"
                    notifications={notifications}
                    setNotifications={setNotifications}
                  />
                </li>
              )}

              {!user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/register">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/login">
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
