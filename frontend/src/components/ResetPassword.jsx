import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


 // Function to validate password format
 const validatePassword = (newPassword) => {
    const regex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/; // Must contain at least one capital letter, one number, and be 8+ characters
    return regex.test(newPassword);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();


    // Validate password format
    if(!validatePassword(newPassword)) {
        setMessage('Password must be at least 8 characters long and contain at least one number and one uppercase letter');
        return;
      }

    try {
      const response = await axios.post(`http://localhost:5000/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
      // Optionally redirect to login page after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          placeholder="Enter new password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          required 
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
