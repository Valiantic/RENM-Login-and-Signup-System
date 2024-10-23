import React from 'react';
import { useAuth } from '../AuthContext'; // Assuming you have an AuthContext

const Customer = () => {
  const { user } = useAuth(); // Get the logged-in user data from context

  return (
    <div>
       {/* display username */}
      <h1>Welcome {user ? user.username : 'Guest'}!</h1>
    </div>
  );
};

export default Customer;
