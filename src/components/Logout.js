import React from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="logout-container">
      <div className="logout-card">
        <h2>👋 Ready to leave?</h2>
        <p>Click the button below to securely log out.</p>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
