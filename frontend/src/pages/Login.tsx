import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { loginUser } from "../api/Api";
import {
  getRoleBasedRoute,
  removeAuthorFromLocalStorage,
  saveUserToLocalStorage,
} from "../api/utils";

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
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

  useEffect(() => {
    if (user) {
      navigate(getRoleBasedRoute(user.role_id));
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const email = emailRef.current?.value.trim() || "";
    const password = passwordRef.current?.value.trim() || "";

    try {
      const { user, author } = await loginUser(email, password);
      if (!user) throw new Error("User data is missing from response");

      setUser(user);
      setAuthor(author || null);

      saveUserToLocalStorage(user, author);

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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default Login;
