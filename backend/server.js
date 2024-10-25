// DECLARE DEPENDENCIES
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cors = require('cors');

// Import nodemailer and crypto
const nodemailer = require('nodemailer');
const crypto = require('crypto'); 

// Create an Express app
const app = express();
const PORT = 5000;

// Middleware // allows the server to connect with frontend
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// MySQL Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Update with your MySQL username
  password: '',  // Update with your MySQL password
  database: 'db_ibbakes'
});

// Connect to MySQL
db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Routes

// Sign-up Route
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Hash password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    const query = 'INSERT INTO tbl_users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) return res.status(400).json({ error: 'Email already exists' });
      res.status(201).json({ message: 'User registered' });
    });
  });
});

// FORGOT PASSWORD FUNCTIONALITY

// FORGOT PASSWORD EMAIL SENDER USING NODEMAILER 

// Setup your SMTP transport service
const transporter = nodemailer.createTransport({
  service: 'Gmail',  // You can use other services like 'SendGrid', 'Outlook', etc.
  auth: {
    user: 'stevenmadali17@gmail.com', 
    pass: 'odei efvp hufg rccu' 
  }
});

// Send an email
const sendResetEmail = (email, token) => {
  const resetLink = `http://localhost:5173/reset-password/${token}`;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Please use the following link to reset your password: ${resetLink}`,
    html: `<p>You requested a password reset. Please use the following link to reset your password:</p><a href="${resetLink}">Reset Password</a>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error sending email: ', err);
      return res.status(500).json({ error: 'Error sending email' });
    }
    console.log('Email sent: ', info.response);
    res.status(200).json({ message: 'Reset email sent' });
  });
  

  return transporter.sendMail(mailOptions);
};




// Forgot Password Route
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  const query = 'SELECT * FROM tbl_users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (result.length === 0) {
      return res.status(400).json({ error: 'No account with that email found' });
    }

    const user = result[0];
    
    // Generate reset token (random string)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

    // Update user's reset token and expiration in the database
    const updateQuery = 'UPDATE tbl_users SET reset_token = ?, reset_token_expires = ? WHERE email = ?';
    db.query(updateQuery, [resetToken, tokenExpiration, email], (err, result) => {
      if (err) return res.status(500).json({ error: 'Server error' });

      // Send email with reset token
      sendResetEmail(email, resetToken)
        .then(() => res.status(200).json({ message: 'Reset email sent' }))
        .catch(err => res.status(500).json({ error: 'Error sending email' }));
    });
  });
});

// Reset Password Route
app.post('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const query = 'SELECT * FROM tbl_users WHERE reset_token = ? AND reset_token_expires > ?';
  db.query(query, [token, Date.now()], (err, result) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (result.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const user = result[0];

    // Hash new password
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: 'Server error' });

      // Update password in the database and clear reset token fields
      const updateQuery = 'UPDATE tbl_users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?';
      db.query(updateQuery, [hashedPassword, user.id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Server error' });

        res.status(200).json({ message: 'Password reset successful' });
      });
    });
  });
});




// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM tbl_users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (result.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result[0];

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Server error' });

      if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

      // Create session
      req.session.userId = user.id;
      req.session.username = user.username;


      // Display username
      if (user.username === 'Admin') {
        return res.json({ message: 'Welcome back Admin!', username: user.username, redirectUrl: '/admin' });
      } else {
        return res.json({ message: 'Login successful!', username: user.username, redirectUrl: '/customer' });
      }

    });
  });
});

// Logout Route
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
