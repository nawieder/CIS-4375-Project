const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Routes
const jobPositionRoutes = require('./routes/jobPositionRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const customerRoutes = require('./routes/customerRoutes'); 
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const port = 3001;  // Define the port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'bluerynodb.cj02o08agyaa.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'BlueRynoProjectDB',
});

// Check connection
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database');
});

// Basic route
app.get('/', (req, res) => {
  res.send('API is working');
});

// Use Routes
app.use('/positions', jobPositionRoutes);  // Add job positions routes under the /positions path
app.use('/vendors', vendorRoutes);   //Vendor Routes
app.use('/customers', customerRoutes);     // Customers routes
app.use('/employees', employeeRoutes);     // Employees routes

// Start server and print clickable link
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

