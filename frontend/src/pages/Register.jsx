import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const formRef = useRef();
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        const formData = {
            email: formRef.current.email.value,
            username: formRef.current.username.value,
            password: formRef.current.password.value,
            role: formRef.current.role.value,
        };

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        try {
            await axios.post("/api/register", formData, {
                headers: { "X-CSRF-TOKEN": csrfToken },
            });

            setSuccess("User created successfully!");
            setErrors([]);
            setLoading(false);
            navigate("/login");
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat();
                setErrors(errorMessages);
            } else if (error.response && error.response.status >= 500) {
                setErrors(["Server error, please try again later."]);
            } else {
                setErrors(["An unexpected error occurred."]);
            }
        }
    };

    return (
        <div className="register-page">
            <form
                ref={formRef}
                className="border border-1 w-50 mx-auto p-3 m-4"
                onSubmit={handleSubmit}
            >
                {success && (
                    <div className="alert alert-success mx-auto mt-4">
                        {success}
                    </div>
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
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default Register;
