import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import { useAuthContext } from "../../shared/components/context/auth-context";
import "./ViewItem.css";

const ViewItem = () => {
  const { id } = useParams();
  const { token, isLoggedIn, userId, admin } = useAuthContext();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/items/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed to load item (${res.status})`);
        }
        setItem(await res.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, token]);

  if (loading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return <h2 style={{ color: "red" }}>Error: {error}</h2>;
  }
  if (!item) {
    return <p>Item not found.</p>;
  }

  return (
    <div className="view-item-container">
      <Link to="/" className="back-link">← Back to listings</Link>
      <div className="view-item-card">
        {item.image && (
          <img
            src={`${import.meta.env.VITE_API_URL}/${item.image}`}
            alt={item.name}
            className="view-item-image"
          />
        )}
        <div className="view-item-details">
          <h2>{item.name}</h2>
          <p><strong>Owner:</strong> {item.owner_name}</p>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Price:</strong> ${item.price}</p>
          <p><strong>Description:</strong></p>
          <p>{item.description}</p>

          {isLoggedIn && (item.owner_id === userId || admin) && (
            <div className="edit-action">
              <Link to={`/items/${item.id}/edit`}>
                <button className="edit-button">Edit Item</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewItem;
