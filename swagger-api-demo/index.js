// index.js
const jwt = require('jsonwebtoken')
const express = require('express');
const setupSwagger = require('./swagger');

const authenticateToken = require('./Auth.js')

const app = express();
app.use(express.json());
const users = [
  {Id:1,
    username: 'admin',
    password: '12345'
  },
  {Id:2,
    username: 'Rich',
    password: '12345'
  },
  {Id:1,
    username: 'Gera',
    password: '12345'
  }
]

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login and get a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token returned
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
 
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
 
  const token = jwt.sign({ username: user.username }, 'your_secret_key', { expiresIn: '1h' });
  res.json({ token });
});

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve a list of items
 *     Security:       
 *        - bearerAuth:[]      
 *     responses:
 *       200:
 *         description: A list of items
 */
app.get('/items',authenticateToken, (req, res) => {
  res.status(200).json({ message: 'GET request - Retrieve items' });
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     Security:
 *       - bearerAuth:[] 
 *     responses:
 *       201:
 *         description: Item created successfully
 */
app.post('/items',authenticateToken, (req, res) => {
  res.status(201).json({ message: 'POST request - Create item' });
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Retrieve a single item by ID
 *     Security:
 *       - bearerAuth:[]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single item
 */
app.get('/items/:id', authenticateToken, (req, res) => {
  res.status(200).json({ message: `GET request - Retrieve item with ID ${req.params.id}` });
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     Security:
 *       - bearerAuth:[]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to update
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 */
app.put('/items/:id', authenticateToken, (req, res) => {
  res.status(200).json({ message: `PUT request - Update item with ID ${req.params.id}` });
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     Security:
 *       - bearerAuth:[] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
app.delete('/items/:id', authenticateToken, (req, res) => {
  res.status(200).json({ message: `DELETE request - Delete item with ID ${req.params.id}` });
});

// Setup Swagger
setupSwagger(app);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
