import React, { useRef, useState, useEffect } from "react";
import { fetchAuthorProfile, updateBio } from "../api/api";

const EditAuthorProfile = () => {
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const bioRef = useRef();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await fetchAuthorProfile();
        setIsVerified(profileData.is_verified);
        bioRef.current.value = profileData.bio;
      } catch (error) {
        setErrors([error.message]);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors([]);
    const bio = bioRef.current.value;

    try {
      await updateBio(bio);
      setSuccess("Bio Updated");
    } catch (error) {
      setErrors([error.message]);
    }
  };

  return (
    <section className="edit-author-profile">
      <form
        className="border border-1 w-50 mx-auto p-3 m-4"
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
          <label htmlFor="bio" className="form-label">
            Your Biography
          </label>
          <textarea
            rows="8"
            className="form-control"
            id="bio"
            name="bio"
            ref={bioRef}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isVerified ? "Edit" : "Verify"}
        </button>
      </form>
    </section>
  );
};

export default EditAuthorProfile;
