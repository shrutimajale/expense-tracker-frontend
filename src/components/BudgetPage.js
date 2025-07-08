import React, { useState } from 'react';
import BudgetForm from './BudgetForm';
import BudgetList from './BudgetList';
import '../styles/Budget.css';

const BudgetPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  return (
    <div className="budget-page">
      <h2 style={{ textAlign: 'center' }}>Manage Your Budgets</h2>
      <BudgetForm onAdd={() => setRefresh(!refresh)} editingBudget={editingBudget} setEditingBudget={setEditingBudget} />
      <BudgetList refresh={refresh} onEdit={setEditingBudget} />
    </div>
  );
};

export default BudgetPage;
