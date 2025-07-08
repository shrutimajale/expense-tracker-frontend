import React from 'react';
import '../styles/Profile.css';

const Profile = () => {
  const user = {
    name: 'Shruti Majale',
    email: 'shruti@example.com',
    phone: '+91-9876543210',
    dob: '1999-01-01'
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>DOB:</strong> {user.dob}</p>
      </div>
    </div>
  );
};

export default Profile;
