import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Reports.css';

const Reports = () => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('jwtToken');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ type: '', categoryId: '' });

  const fetchTransactions = () => {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.categoryId) params.categoryId = filters.categoryId;

    axios.get(`http://localhost:8080/api/reports/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    }).then(res => setTransactions(res.data));
  };

  const fetchCategories = () => {
    axios.get('http://localhost:8080/api/categories', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCategories(res.data));
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [filters]);

  const getDateSuffix = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // 2025-07-08
  };

  const download = async (fileType) => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.categoryId) params.categoryId = filters.categoryId;

      const res = await axios.get(`http://localhost:8080/api/reports/${userId}/${fileType}`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: 'blob',
      });

      const blob = new Blob([res.data], {
        type: fileType === 'pdf' ? 'application/pdf' : 'text/csv',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${getDateSuffix()}.${fileType}`;
      a.click();
    } catch (err) {
      console.error(`${fileType.toUpperCase()} export failed`, err);
      alert(`Failed to download ${fileType.toUpperCase()}`);
    }
  };

  return (
    <div className="report-container">
      <h2>📑 Transaction Report</h2>

      <div className="report-filters">
        <select onChange={e => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <select onChange={e => setFilters({ ...filters, categoryId: e.target.value })}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button onClick={() => download('csv')}>⬇️ Export CSV</button>
        <button onClick={() => download('pdf')}>🧾 Export PDF</button>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.type}</td>
              <td>{t.category?.name}</td>
              <td>₹{t.amount}</td>
              <td>{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
