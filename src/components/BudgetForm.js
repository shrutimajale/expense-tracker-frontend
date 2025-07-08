import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Budget.css';

const BudgetForm = ({ onAdd, editingBudget, setEditingBudget }) => {
  const [budget, setBudget] = useState({
    categoryId: '',
    amount: '',
    startDate: '',
    endDate: ''
  });

  const [categories, setCategories] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (editingBudget) {
      setBudget({
        categoryId: editingBudget.categoryId,
        amount: editingBudget.amount,
        startDate: editingBudget.startDate,
        endDate: editingBudget.endDate
      });
    }
  }, [editingBudget]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/categories/expense', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await axios.put(`http://localhost:8080/api/budgets/${editingBudget.id}`, budget, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:8080/api/budgets/${userId}`, budget, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onAdd();
      setBudget({ categoryId: '', amount: '', startDate: '', endDate: '' });
      setEditingBudget(null);
    } catch (err) {
      console.error('Save budget failed', err);
    }
  };

  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <h3>{editingBudget ? "Edit Budget" : "Add Budget"}</h3>

      <select name="categoryId" value={budget.categoryId} onChange={handleChange} required>
        <option value="">Category</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <input name="amount" type="number" value={budget.amount} onChange={handleChange} placeholder="Amount" required />
      <input name="startDate" type="date" value={budget.startDate} onChange={handleChange} required />
      <input name="endDate" type="date" value={budget.endDate} onChange={handleChange} required />

      <button type="submit">{editingBudget ? "Update" : "Add"} Budget</button>
    </form>
  );
};

export default BudgetForm;
