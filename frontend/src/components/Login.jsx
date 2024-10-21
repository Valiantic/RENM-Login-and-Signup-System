import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // FOR BLANK FIELD DETECTOR
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email) {
      setError('Email is required!');
      return;
    }
    if(!password) {
      setError('Password is required!');
      return;
    }

    setError('');


    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });

      alert(response.data.message);
      navigate(response.data.redirectUrl);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className='Logincontainer'>
      <form className='Loginform' onSubmit={handleSubmit}>
       {error && <p style={{ color: 'red' }}>{error}</p>}

        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
