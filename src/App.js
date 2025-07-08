import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthToggle';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import Calculator from './components/Calculator';
import Profile from './components/Profile';
import Layout from './components/Layout';
import ThemeProvider from './context/ThemeContext';
import BudgetPage from './components/BudgetPage';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Logout from './components/Logout';
import MyTransactions from './components/MyTransactions';
import ManageCategories from './components/ManageCategories';

function App() {
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      document.body.classList.add('dark');
    }
  }, []);
 
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        
        {/* Routes with sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/my-transaction" element={<MyTransactions />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/categories" element={<ManageCategories />} />
          <Route path="/logout" element={<Logout/>} />
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
