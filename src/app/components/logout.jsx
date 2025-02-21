import React from "react";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (response.status === 200) {
        // Clear localStorage to remove the token
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login page
      } else {
        // Handle error if the logout fails
        alert(data.error || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white p-3 rounded-md hover:bg-red-600 focus:outline-none"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
