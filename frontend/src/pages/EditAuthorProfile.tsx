import React, { useRef, useState, useEffect } from "react";
import { fetchAuthorProfile, updateBioAndPfp } from "../api/Api";

const EditAuthorProfile = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const pfpRef = useRef<HTMLInputElement>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await fetchAuthorProfile();
        setIsVerified(profileData.is_verified);
        if (bioRef.current) {
          bioRef.current.value = profileData.bio;
        }
      } catch (error) {
        setErrors([
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        ]);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    setErrors([]);
    const bio = bioRef.current?.value || "";
    const pfp = pfpRef.current?.files?.[0] || null;

    try {
      await updateBioAndPfp(bio, pfp);
      setSuccess(
        isVerified
          ? "Bio Updated"
          : "Your request for verification has been sent successfully."
      );
    } catch (error) {
      setErrors([
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      ]);
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
          <label htmlFor="pfp" className="form-label">
            Profile Picture
          </label>
          <input type="file" className="form-control" id="pfp" ref={pfpRef} />
        </div>
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">
            Your Biography
          </label>
          <textarea
            rows={8}
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
