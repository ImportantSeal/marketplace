import React from "react";
import { useQuery } from "@tanstack/react-query";
import "./Users.css";

const Users = () => {
    const { status, error, data } = useQuery({
        queryKey: ["usersData"],
        queryFn: () =>
          fetch("http://localhost:5000/api/users").then((res) => res.json()),
      });
      

  if (status === "loading") {
    return <p className="center">Loading users...</p>;
  }

  if (error) {
    return <p className="center">Error: {error.message}</p>;
  }

  const users = data || [];

  return (
    <div className="users-container">
      <h2>All Users</h2>
      {users.length > 0 ? (
        <ul className="users-list">
          {users.map((user) => (
            <li key={user.id} className="user-card">
              <p>
                <strong>{user.name}</strong> ({user.email})
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Users;
