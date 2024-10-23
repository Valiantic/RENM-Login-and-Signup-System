import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false); // By default, user is not authenticated


  const login = (userData) => {
    setUser(userData); // Store user data after login

     // FOR PRIVATE ROUTE FUNCTIONALITY
     // Save login status
     setIsAuthenticated(true);
     // Save user data if needed (e.g., in localStorage)
     localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null); // Clear user data on logout

    // FOR PRIVATE ROUTE FUNCTIONALITY
     // Remove authentication status
     setIsAuthenticated(false);
     // Clear user data
     localStorage.removeItem('user');
  };

  return (
    // ADD isAuthenticated to the value object
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
