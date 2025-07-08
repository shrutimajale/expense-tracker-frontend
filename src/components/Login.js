// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css'; // ✅ Use the same CSS as Signup for consistent styling

const Login = ({ onToggle }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [loginMessage, setLoginMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Accept': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: formData.emailOrPhone, // match backend key
          password: formData.password,
        }),
      });

      if (!res.ok) {
        setLoginMessage('Invalid credentials');
        return;
      }
      const result = await res.json();
      const token = result.token;
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userId', result.userId);
      setLoginMessage('Login successful');
      setFormData({ emailOrPhone: '', password: '' });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setLoginMessage('Login failed');
    }
  };

  return (
    <div className="signup-container auth-page-background"> {/* ✅ Match Signup's outer class */}
      <div className="signup-box"> {/* ✅ Match Signup's inner box */}
        <h2>Expense Tracker - Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email or Phone"
            value={formData.emailOrPhone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Sign In</button>
        </form>

        <p className="signin-link">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onToggle(); }}>
            Sign Up
          </a>
        </p>

        {loginMessage && (
          <p className={loginMessage.toLowerCase().includes('success') ? 'success' : 'error'}>
            {loginMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
