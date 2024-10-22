import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css';
import { useAuth } from '../AuthContext'; // Import AuthContext



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth(); // Get login function from AuthContext


  // FOR BLANK FIELD DETECTOR
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');



    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });

      setSuccess(response.data.message); // Set success message
      login({ username: response.data.username }); // Store user data in context

      // REDIRECT AFTER A BRIEF DELAY
      setTimeout(() => {
        navigate(response.data.redirectUrl); // Redirect to admin or customer page
      }, 500);

    } catch (error) {
      // alert(error.response.data.error || 'Login failed');

      if (error.response) {
        // Check for specific error messages
        if (error.response.status === 401) {
            setMessage('Incorrect email or password'); // Generic message for invalid credentials
        } 
        else if(!email) {
          setError('Email is required!');
          return;
        }
        else if(!password) {
          setError('Password is required!');
          return;
        }
        else {
            setMessage('Incorrect email or password');
        }
        
    } else {
        setMessage('An error occurred. Please try again.');
    }

    // Automatically clear the message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className='Logincontainer'>


      <form className='Loginform' onSubmit={handleSubmit}>
        
    
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        {message && (
                <p style={{ marginTop: '15px', color: 'red' }}>
                    {message}
                      {/* SUCCESS */}

                </p>

                
            )}

        {/* SUCCESS */}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {/* ERROR */}
       {error && <p style={{ color: 'red' }}>{error}</p>}

        
        <button type="submit">Login</button>
        <p>Don't have an account?</p>
        <button onClick={() => navigate('/signup')}>Go to Signup</button>


    

      </form>
    </div>
  );
};

export default Login;
