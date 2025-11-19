const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
// Use the port provided by the cloud environment or default to 3001
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-prod';

app.use(cors());
app.use(express.json());

// --- Serve Static Frontend ---
// This allows the Node.js server to serve the React app structure
app.use(express.static(path.join(__dirname, '../dist')));

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

// --- API Routes ---

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', port: PORT });
});

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

app.get('/api/projects', authenticateToken, (req, res) => {
    res.json(projects);
});

app.post('/api/projects', authenticateToken, requireAdmin, (req, res) => {
    const newProject = { id: Date.now().toString(), ...req.body };
    projects.push(newProject);
    res.json(newProject);
});

app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
    res.json(users.map(({password, ...u}) => u));
});

// --- Catch-all for React Router ---
// Any request not handled by API or static files returns index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// --- Start Server ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});