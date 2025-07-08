import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TransactionList.css';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('jwtToken');

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/transactions/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTransactions();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="transaction-list">
    <table className="transaction-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(t => (
          <tr key={t.id}>
            <td>{t.date}</td>
            <td>{t.category?.name || 'Unknown'}</td>
            <td>{t.type}</td>
            <td>₹{t.amount}</td>
            <td>{t.description}</td>
            <td>
              <div className="transaction-actions">
                <button className="transaction-button edit" onClick={() => alert('Edit feature coming soon')}>Edit</button>
                <button className="transaction-button delete" onClick={() => deleteTransaction(t.id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default TransactionList;
