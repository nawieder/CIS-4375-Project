const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Updated Routes
const vendorRoutes = require('./routes/vendorRoutes');
const customerRoutes = require('./routes/customerRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const quotesRoutes = require('./routes/quotesRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const projectRoutes = require('./routes/projectRoutes');  // New Projects routes
const paymentRoutes = require('./routes/paymentRoutes');  // New Payments routes
const invoiceRoutes = require('./routes/invoiceRoutes');  // New Invoices routes
const passwordRoutes = require('./routes/passwordRoutes'); // New Password routes

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

// Use Updated Routes
app.use('/vendors', vendorRoutes);         // Vendor Routes
app.use('/customers', customerRoutes);     // Customers routes
app.use('/inventory', inventoryRoutes);    // Inventory routes
app.use('/quotes', quotesRoutes);          // Quotes routes
app.use('/feedback', feedbackRoutes);      // Feedback routes
app.use('/projects', projectRoutes);       // New Projects routes
app.use('/payments', paymentRoutes);       // New Payments routes
app.use('/invoices', invoiceRoutes);       // New Invoices routes
app.use('/passwords', passwordRoutes);     // New Password routes

// Start server and print clickable link
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

