import React, { useState } from 'react';
import '../styles/Signup.css';

const Signup = ({ onToggle }) => {
  const [formData, setFormData] = useState({
    username: '',
    dob: '',
    email: '',
    phone: '',
    otp: '',
    password: '',
    confirmPassword: '',
    verificationMethod: '',
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);


 
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  
    if (name === 'username' && value.trim()) {
      try {
        const res = await fetch(`http://localhost:8080/api/users/check-username?username=${value}`);
        const isAvailable = await res.json();
        setUsernameAvailable(isAvailable);
      } catch (err) {
        setUsernameAvailable(null); // error state
      }
    }
  };
  

  const validateBeforeOtp = () => {
    const newErrors = {};
    if (!formData.username) newErrors.userusername = 'userusername is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.verificationMethod) newErrors.verificationMethod = 'Choose verification method';
    if (formData.verificationMethod === 'email' && !formData.email) newErrors.email = 'Email is required';
    if (formData.verificationMethod === 'phone' && !formData.phone) newErrors.phone = 'Phone is required';
    return newErrors;
  };

  const handleSendOtp = async () => {
    const validationErrors = validateBeforeOtp();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const contact = formData.verificationMethod === 'email' ? formData.email : formData.phone;

    try {
      const res = await fetch(`http://localhost:8080/api/otp/send-${formData.verificationMethod}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [formData.verificationMethod]: contact }),
      });
      const data = await res.text();
      setVerificationMessage(data);
      setOtpSent(true);
    } catch (error) {
      setVerificationMessage('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    const contact = formData.verificationMethod === 'email' ? formData.email : formData.phone;

    try {
      const res = await fetch(`http://localhost:8080/api/otp/verify-${formData.verificationMethod}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [formData.verificationMethod]: contact, otp: formData.otp }),
      });
      const data = await res.text();

      if (data.toLowerCase().includes('success')) {
        setOtpVerified(true);
        setVerificationMessage('OTP Verified Successfully');
      } else {
        setVerificationMessage('OTP Verification Failed');
        setOtpVerified(false);
      }
    } catch (error) {
      setVerificationMessage('Verification Error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    if (!formData.password || !formData.confirmPassword) {
      newErrors.password = 'Password and confirm password are required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
  
    if (!otpVerified) {
      newErrors.otp = 'Please verify OTP first';
    }
  
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const res = await fetch('http://localhost:8080/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.text();
  
      // Clear all the form data and reset states
      setFormData({
        username: '',
        dob: '',
        email: '',
        phone: '',
        otp: '',
        password: '',
        confirmPassword: '',
        verificationMethod: '',
      });
      setErrors({});
      setOtpSent(false);
      setOtpVerified(false);
      setVerificationMessage('');
  
      alert(result);
    } catch (err) {
      alert('Signup failed');
    }
  };
  

  return (
    <div className="signup-container auth-page-background">
      <div className="signup-box">
        <h2>Expense Tracker - Sign Up</h2>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
        />
        {usernameAvailable === true && (
  <span className="available">Username is available</span>
        )}
        {usernameAvailable === false && (
         <span className="error">Username is not available</span>
        )}
        {errors.username && <span className="error">{errors.username}</span>}


          <input type="date" name="dob" placeholder="DOB" value={formData.dob} onChange={handleChange} />
          <span className="error">{errors.dob}</span>

          <select name="verificationMethod" value={formData.verificationMethod} onChange={handleChange}>
            <option value="">Choose Verification Method</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
          <span className="error">{errors.verificationMethod}</span>

          {formData.verificationMethod === 'email' && (
            <>
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              <span className="error">{errors.email}</span>
            </>
          )}

          {formData.verificationMethod === 'phone' && (
            <>
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
              <span className="error">{errors.phone}</span>
            </>
          )}

          {!otpSent ? (
            <button type="button" onClick={handleSendOtp}>Send OTP</button>
          ) : (
            <>
              <input type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} />
              <span className="error">{errors.otp}</span>
              <button type="button" onClick={handleVerifyOtp}>Verify OTP</button>
            </>
          )}

          {verificationMessage && (
            <p className={otpVerified ? "success" : "error"}>{verificationMessage}</p>
          )}

          {otpVerified && (
            <>
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
              <span className="error">{errors.password}</span>

              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
              <span className="error">{errors.confirmPassword}</span>

              <button type="submit">Sign Up</button>
            </>
          )}
        </form>
        <p className="signin-link">
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onToggle(); }}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
