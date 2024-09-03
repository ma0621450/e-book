import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Post from "./components/Post.jsx";
import AuthorProfile from "./pages/AuthorProfile.jsx";
import EditAuthorProfile from "./pages/EditAuthorProfile.jsx";
import AuthorPublications from "./pages/AuthorPublications.jsx";
import PublishForm from "./pages/PublishForm.jsx";
import Library from "./pages/Library.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import NotFound from "./components/NotFound.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Unauthorized from "./components/Unauthorized.jsx";

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
                        <Library />,
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
                    <PrivateRoute role={2} path="/author/profile/edit">
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

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    </StrictMode>
);
