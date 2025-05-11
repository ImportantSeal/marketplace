import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../shared/components/context/auth-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./ItemsList.css";

const deleteItem = async ({ id, token }) => {
  const response = await fetch(`/api/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to delete item");
  }
  return response.json();
};

const ItemsList = ({ items }) => {
  const { isLoggedIn, token, userId, admin } = useAuthContext();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["itemsData"]);
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate({ id, token });
    }
  };

  if (!items || items.length === 0) {
    return <p>No items found.</p>;
  }

  return (
    <ul className="items-list">
      {items.map((item) => (
        <li key={item.id} className="item-card">
          {item.image && (
            <Link to={`/items/${item.id}`}>
              <img
                src={`/uploads/${item.image.split("/").pop()}`}
                alt={item.name}
                className="item-image"
              />
            </Link>
          )}
          <div className="item-details">
            <h3>
              <Link to={`/items/${item.id}`}>{item.name}</Link>
            </h3>
            <p><strong>Owner:</strong> {item.owner_name}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Price:</strong> ${item.price}</p>
            {(isLoggedIn && (item.owner_id === userId || admin)) && (
              <div className="item-actions">
                <Link to={`/items/${item.id}/edit`}>
                  <button className="edit-button">Edit</button>
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ItemsList;