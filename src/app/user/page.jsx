"use client";
import { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken"); // Get token from localStorage

      if (!token) {
        setError("User is not authenticated");
        return;
      }

      try {
        const response = await fetch("/api/v1/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user); // Successfully fetched user data
        } else {
          setError(data.error || "Failed to fetch user data");
        }
      } catch (err) {
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  if (error) return <div>{error}</div>;

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>User Profile</h2>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
    </div>
  );
};

export default UserProfile;
