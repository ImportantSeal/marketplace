import React, { useEffect, useState } from 'react';
import ItemsList from '../components/ItemsList';
import LoadingSpinner from '../../shared/LoadingSpinner/LoadingSpinner';
import { useAuthContext } from '../../shared/components/context/auth-context';

const MyListings = () => {
  const { token } = useAuthContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchMyItems = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/items/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed to load (${res.status})`);
        }
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, [token]);

  if (loading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <h1 style={{ color: 'red' }}>
        Error loading your listings: {error}
      </h1>
    );
  }

  if (items.length === 0) {
    return <p>You have no listings yet.</p>;
  }

  return (
    <div>
      <h2>My Listings</h2>
      <ItemsList items={items} />
    </div>
  );
};

export default MyListings;
