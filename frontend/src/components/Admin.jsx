import React from 'react';
import { useAuth } from '../AuthContext'; // Assuming you have an AuthContext

const Admin = () => {
  const { user } = useAuth(); // Get the logged-in user data from context

  return (
    <div>
       {/* display username */}
      <h1>Welcome back {user ? user.username : 'Guest'}!</h1>
    </div>
  );
};

export default Admin;
