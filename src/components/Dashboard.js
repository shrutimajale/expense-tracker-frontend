import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler
} from 'chart.js';

import '../styles/Dashboard.css';

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    if (!token || !userId) return;

    // Dashboard Summary
    axios.get(`http://localhost:8080/api/dashboard/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));

    // Budgets
    axios.get(`http://localhost:8080/api/budgets/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBudgets(res.data))
      .catch(err => console.error("Budget fetch error:", err));

    // Recent Transactions
    axios.get(`http://localhost:8080/api/transactions/recent/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setRecentTxns(res.data))
      .catch(err => console.error("Txn fetch error:", err));

    // Category Map
    axios.get(`http://localhost:8080/api/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const map = {};
        res.data.forEach(c => {
          map[c.id] = c.name;
        });
        setCategoryMap(map);
      })
      .catch(err => console.error("Category fetch error:", err));
  }, [userId, token]);

  if (!summary) return <p>Loading...</p>;
  const categoryIds = Object.keys(summary.categorySummary);
  const categoryLabels = categoryIds.map(id => categoryMap[id] || `Category ${id}`);
  
  const pieData = {
    labels: categoryLabels,
    datasets: [{
      data: Object.values(summary.categorySummary),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00D084', '#FF9F40']
    }]
  };

  const lineData = {
    labels: Object.keys(summary.monthlySummary),
    datasets: [
      {
        label: 'Income',
        data: Object.values(summary.monthlySummary).map(m => m.INCOME || 0),
        borderColor: '#36A2EB',
        fill: false
      },
      {
        label: 'Expense',
        data: Object.values(summary.monthlySummary).map(m => m.EXPENSE || 0),
        borderColor: '#FF6384',
        fill: false
      }
    ]
  };

  return (
    <div className="dashboard-container">
      <div className="summary-cards">
        <div className="card income">Income: ₹{summary.totalIncome}</div>
        <div className="card expense">Expense: ₹{summary.totalExpense}</div>
        <div className="card balance">Balance: ₹{summary.balance}</div>
      </div>

      <div className="charts">
        <div className="chart">
          <h3>Expenses by Category</h3>
          <div className="pie-wrapper">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart">
          <h3>Monthly Income vs Expense</h3>
          <Line data={lineData} />
        </div>
      </div>

      <div className="budget-overview">
        <h3>Budget vs Expense</h3>
        <table className="budget-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Remaining</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map(b => {
             const categoryId = b.category?.id;
             const categoryName = categoryMap[categoryId] || 'Unknown';
             const spent = summary.categorySummary[categoryId] || 0;
             const remaining = Math.max(0, b.amount - spent);
             
             const actualPercent = (spent / b.amount) * 100;
             
             const percent = Math.min(100, actualPercent);
            
             const status = actualPercent > 100
               ? "over"
               : actualPercent > 75
                 ? "warning"
                 : "ok";

              return (
                <tr key={b.id}>
                  <td>{categoryName}</td>
                  <td>₹{b.amount}</td>
                  <td>₹{spent}</td>
                  <td>₹{remaining}</td>
                  <td>
              <div className="progress-bar">
                  <div className="fill" style={{ width: `${percent}%` }} />
               </div>
             <span>{actualPercent.toFixed(1)}%</span>
              </td>
<td>
  {status === "over" ? (
    <span className="status over">❌ Over Budget</span>
  ) : status === "warning" ? (
    <span className="status warning">⚠️ Approaching Limit</span>
  ) : (
    <span className="status ok">✅ All Good</span>
  )}
</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        <table className="txn-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {recentTxns.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.category?.name || 'Unknown'}</td>
                <td>{t.type}</td>
                <td>₹{t.amount}</td>
                <td>{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
