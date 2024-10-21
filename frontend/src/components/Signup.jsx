import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/signup.css';


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // FOR BLANK FIELD DETECTOR
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePassword = (password) => {
    // Check if password is at least 8 characters long
    return password.length >= 8;
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
      setError('Password must be at least 8 characters long!');
      return;
    }
  

    setError('');


    try {
      await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password
      });
    
      alert('User registered successfully');
      navigate('/login');
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className='Signupcontainer'>
      <form className='Signupform' onSubmit={handleSubmit}>

      {error && <p style={{ color: 'red' }}>{error}</p>}

        <h2>Sign Up</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Sign Up</button>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </form>
    </div>
  );
};

export default SignUp;
