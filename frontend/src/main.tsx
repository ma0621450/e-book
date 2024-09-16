import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Post from "./components/Post";
import AuthorProfile from "./pages/AuthorProfile";
import EditAuthorProfile from "./pages/EditAuthorProfile";
import AuthorPublications from "./pages/AuthorPublications";
import PublishForm from "./pages/PublishForm";
import Library from "./pages/Library";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./components/NotFound";
import { UserProvider } from "./context/UserContext";
import PrivateRoute from "./components/PrivateRoute";
import Unauthorized from "./components/Unauthorized";

type Role = 1 | 2 | 3;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute role={1}>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/post/:id",
        element: (
          <PrivateRoute role={[1, 2, 3]}>
            <Post />
          </PrivateRoute>
        ),
      },
      {
        path: "/library",
        element: (
          <PrivateRoute role={1}>
            <Library />
          </PrivateRoute>
        ),
      },
      {
        path: "/author/profile/:id",
        element: (
          <PrivateRoute role={[1, 2, 3]}>
            <AuthorProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/author/profile/edit",
        element: (
          <PrivateRoute role={2}>
            <EditAuthorProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/author/publications",
        element: (
          <PrivateRoute role={2}>
            <AuthorPublications />
          </PrivateRoute>
        ),
      },
      {
        path: "/author/publish",
        element: (
          <PrivateRoute role={2}>
            <PublishForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/author/publish/edit/:id",
        element: (
          <PrivateRoute role={2}>
            <PublishForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <PrivateRoute role={3}>
            <AdminPanel />
          </PrivateRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
