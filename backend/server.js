// DECLARE DEPENDENCIES
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
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

      if (user.username === 'Admin') {
        return res.json({ message: 'Welcome back Admin!', redirectUrl: '/admin' });
      } else {
        return res.json({ message: 'Login successful!', redirectUrl: '/customer' });
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
