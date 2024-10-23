import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Customer from './components/Customer';
import Admin from './components/Admin';
import Error from './components/Error';

import { AuthProvider } from './AuthContext'; // Import the AuthProvider
import PrivateRoute from './PrivateRoute'; // Restrict access to private routes

function App() {
  return (
    <AuthProvider>
       <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

           {/* Protect the /admin route */}
          <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />

          {/* Protect the /customer route */}
          <Route path="/customer" element={<PrivateRoute><Customer /></PrivateRoute>} />
          
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
