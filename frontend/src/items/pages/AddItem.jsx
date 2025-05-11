import React, { useState } from 'react';
import { useAuthContext } from '../../shared/components/context/auth-context';
import { useHistory } from 'react-router-dom';
import { categories } from '../../constants/categories';

const AddItem = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageFile: null,
  });
  const { token } = useAuthContext();
  const history = useHistory();

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
    if (form.imageFile) {
      data.append('image', form.imageFile);
    }

    const res = await fetch(`/api/items`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add item');
    }

    // after creation, go back to home
    history.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <input
        name="name"
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
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
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        name="imageFile"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItem;
