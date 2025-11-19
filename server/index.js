/*
 * NOTE: This is the reference implementation for the Backend API.
 * In this browser sandbox environment, the React application uses 
 * services/api.ts to mock these endpoints directly.
 * 
 * To run this server locally:
 * 1. npm install express cors jsonwebtoken body-parser
 * 2. node server/index.js
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'your-secret-key';

app.use(cors());
app.use(bodyParser.json());

// --- Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') return res.sendStatus(403);
    next();
};

// --- Mock Database ---
const users = [
    { id: '1', email: 'admin@proptech.com', password: 'password', role: 'ADMIN', name: 'Alice' },
    { id: '2', email: 'manager@proptech.com', password: 'password', role: 'MANAGER', name: 'Bob' }
];

const projects = [
    { id: 'p1', name: 'Sunrise Towers', city: 'New York', status: 'Construction' }
];

// --- Routes ---

// Auth
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        const { password, ...userWithoutPass } = user;
        res.json({ token, user: userWithoutPass });
    } else {
        res.status(401).send('Username or password incorrect');
    }
});

// Projects
app.get('/api/projects', authenticateToken, (req, res) => {
    res.json(projects);
});

app.post('/api/projects', authenticateToken, requireAdmin, (req, res) => {
    const newProject = { id: Date.now().toString(), ...req.body };
    projects.push(newProject);
    res.json(newProject);
});

// Users (Admin only)
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
    res.json(users.map(({password, ...u}) => u));
});

// Start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});