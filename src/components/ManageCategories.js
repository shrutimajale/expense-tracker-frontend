import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManageCategories.css';

const ManageCategories = () => {
  const token = localStorage.getItem('jwtToken');
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'EXPENSE' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const fetchCategories = () => {
    axios.get('http://localhost:8080/api/categories', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCategories(res.data));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nameExists = categories.some(
      (cat) =>
        cat.name.toLowerCase() === form.name.toLowerCase() &&
        cat.type === form.type &&
        cat.id !== editId
    );

    if (nameExists) {
      setError('Category already exists');
      return;
    }

    setError('');
    const method = editId ? 'put' : 'post';
    const url = editId
      ? `http://localhost:8080/api/categories/${editId}`
      : `http://localhost:8080/api/categories`;

    axios[method](url, form, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setForm({ name: '', type: 'EXPENSE' });
      setEditId(null);
      fetchCategories();
    });
  };

  const handleEdit = (category) => {
    setForm({ name: category.name, type: category.type });
    setEditId(category.id);
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete this category?')) {
      axios.delete(`http://localhost:8080/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(fetchCategories);
    }
  };

  return (
    <div className="category-container">
      <h2>📂 Manage Categories</h2>

      <form className="category-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'} Category</button>
      </form>
      {error && <p className="error-text">{error}</p>}

      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>
                <span
                  className={`badge ${cat.type === 'INCOME' ? 'income' : 'expense'}`}
                >
                  {cat.type === 'INCOME' ? '💰 Income' : '💸 Expense'}
                </span>
              </td>
              <td className="actions">
                <button onClick={() => handleEdit(cat)}>✏️</button>
                <button onClick={() => handleDelete(cat.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategories;
