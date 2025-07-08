import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Budget.css';

const BudgetList = ({ refresh, onEdit }) => {
  const [budgets, setBudgets] = useState([]);
  const [spentMap, setSpentMap] = useState({});

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('jwtToken');

  const fetchSpent = async (budgetId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/budgets/spent/${budgetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      console.error("Error fetching spent:", err);
      return 0;
    }
  };

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/budgets/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const budgetList = res.data;
        console.log("Fetched Budgets++++++++++++:", res.data);
        setBudgets(budgetList);

        // Debug log
        console.log("Fetched budgets:", budgetList);

        // Fetch spent values
        const spentData = {};
        for (let b of budgetList) {
          const spent = await fetchSpent(b.id);
          spentData[b.id] = spent;
        }
        setSpentMap(spentData);

      } catch (err) {
        console.error('Error loading budgets:', err);
      }
    };

    fetchBudgets();
  }, [refresh]);

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(budgets.filter(b => b.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="budget-list">
      <h3>Your Budgets</h3>

      {budgets.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No budgets found.</p>
      ) : (
        <ul>
          {budgets.map(b => {
            const spent = spentMap[b.id] || 0;
            const percent = Math.min((spent / b.amount) * 100, 100).toFixed(0);
            const categoryName = b.category?.name || 'Unknown';

            return (
              <li key={b.id} className="budget-item">
                <div className="budget-header">
                <span>📁 {b.category?.name || 'Unknown'}</span>
                  <span>₹{spent} / ₹{b.amount}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${spent > b.amount ? 'over' : 'ok'}`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="budget-footer">
                  {b.startDate} to {b.endDate}
                  <div className="action-buttons">
                    <button onClick={() => onEdit(b)}>✏️</button>
                    <button onClick={() => deleteBudget(b.id)}>🗑️</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BudgetList;
