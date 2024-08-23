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

const students = [
  {
    "id": 1,
    "firstName": "Jose",
    "lastName": "Montaño",
    "age": 21,
    "email": "Jose@axity.com",
    "enrollmentNumber": "2024-001",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "A"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  },
  {
    "id": 2,
    "firstName": "Ricardo",
    "lastName": "Rosas",
    "age": 24,
    "email": "ricardo@axity.com",
    "enrollmentNumber": "2024-002",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "A"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
  },
  {
    "id": 3,
    "firstName": "Sol",
    "lastName": "Medrano",
    "age": 22,
    "email": "sol@axity.com",
    "enrollmentNumber": "2024-001",
    "courses": [
      {
        "courseId": 101,
        "courseName": "Introduction to Programming",
        "grade": "A"
      },
      {
        "courseId": 102,
        "courseName": "Data Structures"
      }
    ],
    "status": "active"
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
 *     security:       
 *        - bearerAuth: []      
 *     responses:
 *       200:
 *         description: A list of items
 */
app.get('/items',authenticateToken, (req, res) => {
  res.status(200).json(students);
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: "The student's first name"
 *               lastName:
 *                 type: string
 *                 description: "The student's last name"
 *               age:
 *                 type: integer
 *                 description: "The student's age"
 *               email:
 *                 type: string
 *                 description: "The student's email address"
 *               enrollmentNumber:
 *                 type: string
 *                 description: "The student's enrollment number"
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: integer
 *                     courseName:
 *                       type: string
 *                     grade:
 *                       type: string
 *               status:
 *                 type: string
 *                 description: "The student's status"
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 enrollmentNumber:
 *                   type: string
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: integer
 *                       courseName:
 *                         type: string
 *                       grade:
 *                         type: string
 *                 status:
 *                   type: string
 */
 
app.post('/items',authenticateToken, (req, res) => {
  const {firstName, lastName, age, email, enrollmentNumber, courses,status} = req.body;
  const studentObject = {
    id: students.length + 1
    ,firstName, 
    lastName,
    age,
    email,
    enrollmentNumber,
    courses,
    status
  }
  students.push(studentObject)
  res.status(201).json(
    { message: 'Se ha agregado un estudiante',
      nuevoEstudiante: studentObject
    });
    
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Retrieve a single item by ID
 *     security:
 *       - bearerAuth: []
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
  const id =  parseInt(req.params.id) 
  const student = students.find(student => student.id == id);

   if(student){
     res.status(200).json(student);
   }
   else{
     res.status(404).json('Estudiante no encontrado ')
   }

});

/**
 * /**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     security: 
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to retrieve
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: "The student's first name"
 *               lastName:
 *                 type: string
 *                 description: "The student's last name"
 *               age:
 *                 type: integer
 *                 description: "The student's age"
 *               email:
 *                 type: string
 *                 description: "The student's email address"
 *               enrollmentNumber:
 *                 type: string
 *                 description: "The student's enrollment number"
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     courseId:
 *                       type: integer
 *                     courseName:
 *                       type: string
 *                     grade:
 *                       type: string
 *               status:
 *                 type: string
 *                 description: "The student's status"
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 enrollmentNumber:
 *                   type: string
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: integer
 *                       courseName:
 *                         type: string
 *                       grade:
 *                         type: string
 *                 status:
 *                   type: string
 */
 
app.put('/items/:id', authenticateToken, (req, res) => {
  const id =  parseInt(req.params.id) 
  const student = students.find(student => student.id == id);
 
  if(student){
    student.firstName = (req.body.firstName)
    student.lastName =(req.body.lastName)
    student.age =(req.body.age)
    student.email = req.body.email
    student.enrollmentNumber = req.body.enrollmentNumber  
    student.courses = req.body.courses
    student.status = req.body.status  
    res.status(200).json(student);
  }
  else{
    res.status(404).json('Estudiante no encontrado')
  }

});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
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
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex(student => student.id === id);
  
  if (studentIndex !== -1) {
    const deletedStudent = students.splice(studentIndex, 1); 
    res.status(200).json({
      message: 'Estudiante eliminado con éxito',
      student: deletedStudent[0]}
    );
  } else {
    res.status(404).json('Estudiante no encontrado');
  }
  
});

// Setup Swagger
setupSwagger(app);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
