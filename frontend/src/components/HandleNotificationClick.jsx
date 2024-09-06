import React from "react";
import { IoNotifications } from "react-icons/io5";
import { markNotificationAsRead } from "../api/api";

const HandleNotificationClick = ({ notifications, setNotifications }) => {
  const handleNotificationClick = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="dropdown">
      <button
        type="button"
        className="btn btn-primary dropdown-toggle"
        id="notificationDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <IoNotifications />
      </button>
      <ul
        className="dropdown-menu custom-dropdown"
        aria-labelledby="notificationDropdown"
      >
        {notifications.length === 0 ? (
          <li>No notifications</li>
        ) : (
          notifications.map((notification) => (
            <li
              className="border-bottom p-3 fw-medium cursor-pointer"
              role="button"
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
            >
              {notification.message}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default HandleNotificationClick;
