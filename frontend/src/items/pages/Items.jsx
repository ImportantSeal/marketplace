import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ItemsList from '../components/ItemsList';
import LoadingSpinner from '../../shared/LoadingSpinner/LoadingSpinner';
import { categories } from '../../constants/categories';
import Input from '../../shared/components/input/input';
import './Items.css';

const sortOptions = [
  { label: 'Newest → Oldest', value: 'id_desc' },
  { label: 'Oldest → Newest', value: 'id_asc' },
  { label: 'Price ↑',       value: 'price_asc' },
  { label: 'Price ↓',       value: 'price_desc' },
];

const Items = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'id_desc',
  });

  const { status, error, data: items, refetch } = useQuery({
    queryKey: ['itemsData', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search)   params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sort)     params.append('sort', filters.sort);

      const res = await fetch(
        `/api/items?${params.toString()}`
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Fetch failed (${res.status})`);
      }
      return res.json();
    },
    keepPreviousData: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => refetch();

  if (status === 'loading') {
    return (<div className="center"><LoadingSpinner /></div>);
  }
  if (status === 'error') {
    return <h1 style={{ color: 'red' }}>Error: {error.message}</h1>;
  }

  return (
    <div>
      <h2>Marketplace Listings</h2>
      <div className="filter-bar">
        <div className="filter-group search-group">
          <label>Search</label>
          <Input
            id="search"
            type="text"
            name="search"
            placeholder="Search by title…"
            value={filters.search}
            onChange={handleChange}
          />
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="">All</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Min Price</label>
          <Input
            id="minPrice"
            type="number"
            name="minPrice"
            placeholder="0"
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>
        <div className="filter-group">
          <label>Max Price</label>
          <Input
            id="maxPrice"
            type="number"
            name="maxPrice"
            placeholder="0"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>
        <div className="filter-group">
          <label>Sort</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="filter-select"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button className="filter-apply" onClick={applyFilters}>
          Apply
        </button>
      </div>

      <ItemsList items={items} />
    </div>
  );
};

export default Items;
