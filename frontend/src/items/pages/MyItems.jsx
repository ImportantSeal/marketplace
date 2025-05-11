import React, { useEffect, useState } from 'react';
import ItemsList from '../components/ItemsList';
import LoadingSpinner from '../../shared/LoadingSpinner/LoadingSpinner';
import { useAuthContext } from '../../shared/components/context/auth-context';

const MyItems = () => {
  const { token } = useAuthContext();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMy = async () => {
      try {
        const res = await fetch('/api/items/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load your listings');
        setItems(await res.json());
      } catch (e) {
        setError(e.message);
      }
    };
    fetchMy();
  }, [token]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!items) return <LoadingSpinner />;
  if (items.length === 0) return <p>No listings found.</p>;

  return (
    <div>
      <h2>My Listings</h2>
      <ItemsList items={items} />
    </div>
  );
};

export default MyItems;
