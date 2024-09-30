const mysql = require('mysql2');

// Set up the database connection with MySQL for Blue Ryno Fence
const connection = mysql.createConnection({
  host: 'localhost',  // MySQL is running on your computer (localhost)
  user: 'root',       // The default MySQL user is 'root'
  password: 'admin123',  // Use the password you set during installation
  database: 'blue_ryno_fence_db'  // This is the name of the database we'll create
});

// Establish the connection and handle any errors
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed for Blue Ryno Fence:', err.stack);
    return;
  }
  console.log('Connected to the Blue Ryno Fence database.');
});
