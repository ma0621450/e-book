import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/Api";

interface FormValues {
  email: string;
  username: string;
  password: string;
  role: string;
}

const Register: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    if (formRef.current) {
      const formData = new FormData(formRef.current);

      try {
        await registerUser(formData);
        setSuccess("User created successfully!");
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        setErrors([
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        ]);
      }
    } else {
      setLoading(false);
      setErrors(["Form reference is not available."]);
    }
  };

  return (
    <div className="register-page">
      <form
        ref={formRef}
        className="border border-1 rounded w-50 mx-auto p-3 m-4"
        onSubmit={handleSubmit}
      >
        {success && (
          <div className="alert alert-success mx-auto mt-4">{success}</div>
        )}
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
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="roleSelect" className="form-label">
            Select Role
          </label>
          <select className="form-select" id="roleSelect" name="role">
            <option value="">Choose a role...</option>
            <option value="1">User</option>
            <option value="2">Author</option>
          </select>
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
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Register;
