import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Settings.css';

const Settings = () => {
  const [income, setIncome] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    axios.get(`http://localhost:8080/api/settings/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const { monthlyIncome, preferredCurrency, darkModeEnabled, notificationsEnabled } = res.data;
      setIncome(monthlyIncome);
      setCurrency(preferredCurrency);
      setDarkMode(darkModeEnabled);
      setNotifications(notificationsEnabled);

      // Apply dark mode on initial load
      if (darkModeEnabled) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }).catch(console.error);
  }, [userId, token]);

  // Reapply dark mode class when toggled
  useEffect(() => {
    axios.get(`http://localhost:8080/api/settings/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const {
        monthlyIncome,
        preferredCurrency,
        darkModeEnabled,
        notificationsEnabled
      } = res.data;
  
      setIncome(monthlyIncome);
      setCurrency(preferredCurrency);
      setDarkMode(darkModeEnabled);
      setNotifications(notificationsEnabled);
  
      // 👇 Save to localStorage for persistence across app
      localStorage.setItem('darkMode', darkModeEnabled);
      // 👇 Apply class to <body>
      document.body.classList.toggle('dark', darkModeEnabled);
    }).catch(console.error);
  }, [userId, token]);

  const saveSettings = () => {
    axios.put(`http://localhost:8080/api/settings/${userId}`, {
      monthlyIncome: income,
      preferredCurrency: currency,
      darkModeEnabled: darkMode,
      notificationsEnabled: notifications
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      alert('Settings saved!');
  
      // ✅ Update localStorage and <body> tag
      localStorage.setItem('darkMode', darkMode);
      document.body.classList.toggle('dark', darkMode);
    }).catch(() => alert('Failed to save settings'));
  };
  return (
    <div className="settings-container">
      <h2>⚙️ Settings</h2>

      <div className="setting-item">
        <label>💰 Monthly Income:</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
      </div>

      <div className="setting-item">
        <label>💱 Currency:</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
        </select>
      </div>

      <div className="setting-item toggle">
        <label>🌗 Dark Mode:</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => {
            const newValue = !darkMode;
                setDarkMode(newValue);
            if (newValue) {
                document.body.classList.add('dark');
              } else {
                document.body.classList.remove('dark');
              }
          }}
        />
      </div>

      <div className="setting-item toggle">
        <label>🔔 Enable Notifications:</label>
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
        />
      </div>

      <button onClick={saveSettings}>💾 Save</button>
    </div>
  );
};

export default Settings;
