import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true); // Show login by default

  const toggleForm = () => {
    setShowLogin((prev) => !prev);
  };

  return (
    <div>
    {showLogin ? (
      <Login onToggle={toggleForm} />
    ) : (
      <Signup onToggle={toggleForm} />
    )}
  </div>
  );
};

export default AuthPage;
