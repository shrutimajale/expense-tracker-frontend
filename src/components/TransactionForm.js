import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TransactionForm.css';

const TransactionForm = ({ onAdd }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);

    const fetchCategories = async () => {
      try {
        const incomeRes = await axios.get('http://localhost:8080/api/categories/income', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const expenseRes = await axios.get('http://localhost:8080/api/categories/expense', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIncomeCategories(incomeRes.data);
        setExpenseCategories(expenseRes.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategoryId) {
      alert("Please select a category.");
      return;
    }

    const transaction = {
      amount,
      type,
      date,
      description,
      category: { id: selectedCategoryId }
    };

    try {
      await axios.post(`http://localhost:8080/api/transactions/${userId}`, transaction, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onAdd(); // Refresh the list
      setAmount('');
      setType('EXPENSE');
      setSelectedCategoryId('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      console.error('Transaction add failed:', err);
    }
  };

  const categoriesToShow = type === 'INCOME' ? incomeCategories : expenseCategories;

  return (
    <form className="transaction-form glassmorphism-form" onSubmit={handleSubmit}>
      <input
        type="number"
        name="amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />

      <select name="type" value={type} onChange={e => setType(e.target.value)}>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
      </select>

      <select
        name="category"
        value={selectedCategoryId}
        onChange={e => setSelectedCategoryId(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        {categoriesToShow.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />

      <input
        type="text"
        name="description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
      />

      <button type="submit">Add Transaction</button>
    </form>
  );
};

export default TransactionForm;
