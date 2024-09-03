import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";

const Login = () => {
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const { user, setUser, setAuthor } = useUser();

    useEffect(() => {
        if (user) {
            const roleRoutes = {
                1: "/",
                2: "/author/profile/edit",
                3: "/admin",
            };
            navigate(roleRoutes[user.role_id]);
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value.trim();
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        try {
            const response = await axios.post(
                "/api/login",
                { email, password },
                { headers: { "X-CSRF-TOKEN": csrfToken } }
            );

            const { user, author } = response.data;
            if (!user) throw new Error("User data is missing from response");

            setUser(user);
            setAuthor(author || null);
            localStorage.setItem("user", JSON.stringify(user));

            if (author) {
                localStorage.setItem("author", JSON.stringify(author));
            } else {
                localStorage.removeItem("author");
            }

            const roleRoutes = {
                1: "/",
                2: "/author/profile/edit",
                3: "/admin",
            };
            navigate(roleRoutes[user.role_id]);
        } catch (error) {
            const errorMessageMapping = {
                422: Object.values(error.response?.data?.errors || {}).flat(),
                401: ["Invalid email or password."],
                403: ["Your account has been blocked."],
            };

            const defaultError = ["An unexpected error occurred."];
            setErrors(
                errorMessageMapping[error.response?.status] || defaultError
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="login-form">
            <form
                className="border border-1 w-50 mx-auto p-3 m-4"
                onSubmit={handleSubmit}
            >
                {errors.length > 0 && (
                    <div className="alert alert-danger mx-auto mt-4">
                        <ul className="mb-0">
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        ref={emailRef}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        ref={passwordRef}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Submit"}
                </button>
            </form>
        </section>
    );
};

export default Login;
