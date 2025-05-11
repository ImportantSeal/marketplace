import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAuthContext } from '../../shared/components/context/auth-context';
import { categories } from '../../constants/categories';
import LoadingSpinner from '../../shared/LoadingSpinner/LoadingSpinner';

const EditItem = () => {
  const { id } = useParams();
  const history = useHistory();
  const { token } = useAuthContext();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/items/${id}`);
        if (!res.ok) throw new Error('Failed to load');
        const item = await res.json();
        setForm({
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
          imageFile: null,
        });
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setForm((f) => ({ ...f, imageFile: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', form.name);
    data.append('price', form.price);
    data.append('description', form.description);
    data.append('category', form.category);
    if (form.imageFile) data.append('image', form.imageFile);

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update');
      }
      history.push('/');
    } catch (e) {
      setError(e.message);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!form) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <input
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={handleChange}
        required
      />
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="imageFile"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditItem;
