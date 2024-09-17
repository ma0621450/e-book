import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginUser } from "../api/Api";
import { FormValues } from "../interfaces";
import {
  getRoleBasedRoute,
  removeAuthorFromLocalStorage,
  saveUserToLocalStorage,
} from "../api/utils";

const Login: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, setAuthor } = useUser();
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const email = emailRef.current?.value.trim() || "";
    const password = passwordRef.current?.value.trim() || "";

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await loginUser(formData);
      const { user, author } = response;

      if (!user) throw new Error("User Data is missing from response.");

      setUser(user);
      setAuthor(author);

      saveUserToLocalStorage(user, author || null);

      if (!author) {
        removeAuthorFromLocalStorage();
      }

      navigate(getRoleBasedRoute(user.role_id));
    } catch (error) {
      if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors(["An unexpected error occurred"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-form">
      <form
        className="border border-1 rounded w-50 mx-auto p-3 m-4"
        onSubmit={handleSubmit}
      >
        {errors.length > 0 && (
          <div className="alert alert-danger mx-auto mt-4">
            {errors.map((error, index) => (
              <p style={{ whiteSpace: "pre-line" }} key={index}>
                {error}
              </p>
            ))}
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default Login;
