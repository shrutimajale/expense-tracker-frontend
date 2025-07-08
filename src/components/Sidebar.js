// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaPlus, FaCalculator, FaFileExport, FaCog } from 'react-icons/fa';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>💰 Expense Tracker</h2>

      <nav>
        <NavLink to="/dashboard">📊 Dashboard</NavLink>
        <NavLink to="/add-transaction">➕ Add Transaction</NavLink>
        <NavLink to="/my-transaction">📁 My Transactions</NavLink>
        <NavLink to="/budget">💼 Budgets</NavLink>
        <NavLink to="/reports">📈 Reports</NavLink>
        <NavLink to="/categories">🏷️ Categories</NavLink>
        <NavLink to="/calculator">🧮 Calculator</NavLink>
        <NavLink to="/settings">⚙️ Settings</NavLink>
        <NavLink to="/logout">🚪 Logout</NavLink>
      </nav>
    </div>
  );
};


export default Sidebar;
