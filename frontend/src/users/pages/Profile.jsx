import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <p>{user.name} ({user.email})</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
