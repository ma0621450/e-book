import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HandleNotificationClick from "./HandleNotificationClick";
import { useUser } from "../context/UserContext";
import { fetchNotifications, logout } from "../api/Api";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, setAuthor } = useUser();
  const [notifications, setNotifications] = useState<any[]>([]); // Update with actual type if known

  useEffect(() => {
    if (user?.role_id === 2) {
      const getNotifications = async () => {
        try {
          const data = await fetchNotifications();
          setNotifications(data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      getNotifications();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAuthor(null);
      navigate("/login"); // Reuse the existing navigate
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <img
          width={"80px"}
          src="https://cdn.dribbble.com/users/72227/screenshots/2609426/media/caf80c50b2b66ad641fe9f651bd6a2db.gif"
          alt="Logo"
        />
        <a style={{ fontFamily: "cursive" }} className="navbar-brand logo">
          Bookflix
        </a>
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
