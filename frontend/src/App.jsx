import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Customer from './components/Customer';
import Admin from './components/Admin';
import Error from './components/Error';

import { AuthProvider } from './AuthContext'; // Import the AuthProvider

function App() {
  return (
    <AuthProvider>
       <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
