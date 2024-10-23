import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';



const Admin = () => {
  const { user } = useAuth(); // Get the logged-in user data from context
  const navigate = useNavigate(); // Get navigate function from react-router-dom
  const { logout } = useAuth(); // Get logout function from AuthContext

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout'); // Call the backend logout route
      logout(); // Clear user data in context
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed', error);
    }
  };



  return (
    <div>
       {/* display username */}
      <h1>Welcome back {user ? user.username : 'Guest'}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Admin;
