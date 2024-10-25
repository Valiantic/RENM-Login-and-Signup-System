import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // State Message to display while sending
  const [isSending, setIsSending] = useState(false); 


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set the sending state to true when the form is submitted
    setIsSending(true); 
    // Set the initial message
    setMessage('Just a moment we are sending the reset link...'); 

    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
    finally {
      // Reset the sending state when the request is complete
      setIsSending(false); 
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

        <button type="submit" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send Reset Link'}
        </button>

      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
