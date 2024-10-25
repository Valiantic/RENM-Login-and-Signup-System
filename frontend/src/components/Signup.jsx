import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/signup.css';


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // FOR BLANK FIELD DETECTOR
  const [error, setError] = useState(''); // For error message
  const [success, setSuccess] = useState(''); // For success message


  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/; // Must contain at least one capital letter, one number, and be 8+ characters
    return regex.test(password);
  };

  // BLANK FIELD DETECTION 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setError('Username is required!');
      return;
    }
    if (!email) {
      setError('Email is required!');
      return;
    }
    if (!password) {
      setError('Password is required!');
      return;
    }

    if(!validateEmail(email)) {
      setError('Invalid email!');
      return;
    }
    if(!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one number and one uppercase letter!');
      return;
    }
  

    setError(''); // Reset error message
    setSuccess(''); // Reset success message



    try {
      await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password
      });


      // Set the success message upon successful signup
      setSuccess('Signup successful! Redirecting...');
    
      // Redirect after a delay to the customer page (replace '/customer' with the correct route)
      setTimeout(() => {
        navigate('/customer');
      }, 2000); // Adjust the delay as necessary


    } catch (error) {
          setError(error.response?.data?.error || 'Signup failed');

    }
  };

  return (
    <div className='Signupcontainer'>
      <form className='Signupform' onSubmit={handleSubmit}>

    
        <h2>Sign Up</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        {/* Display success message */}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        {/* Display error message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        
        <button type="submit">Sign Up</button>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </form>
    </div>
  );
};

export default SignUp;
