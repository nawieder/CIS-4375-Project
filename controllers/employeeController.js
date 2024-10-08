const mysql = require('mysql2');

// MySQL connection
const db = mysql.createConnection({
  host: 'bluerynodb.cj02o08agyaa.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'BlueRynoProjectDB',
});

// GET all employees
exports.getAllEmployees = (req, res) => {
  const sql = 'SELECT * FROM Employee';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).send('Error fetching employees');
    }
    res.json(results);
  });
};

// GET a specific employee by EmployeeID
exports.getEmployeeById = (req, res) => {
  const employeeId = req.params.id;
  const sql = 'SELECT * FROM Employee WHERE EmployeeID = ?';
  db.query(sql, [employeeId], (err, result) => {
    if (err) {
      console.error('Error fetching employee:', err);
      return res.status(500).send('Error fetching employee');
    }
    if (result.length === 0) {
      return res.status(404).send('Employee not found');
    }
    res.json(result[0]);
  });
};

// POST a new employee
exports.createEmployee = (req, res) => {
  const newEmployee = req.body;
  const sql = 'INSERT INTO Employee SET ?';
  db.query(sql, newEmployee, (err, result) => {
    if (err) {
      console.error('Error adding employee:', err);
      return res.status(500).send('Error adding employee');
    }
    res.json({ message: 'Employee created', employeeId: result.insertId });
  });
};

// PUT to update an employee's information
exports.updateEmployee = (req, res) => {
  const employeeId = req.params.id;
  const updatedEmployee = req.body;
  const sql = 'UPDATE Employee SET ? WHERE EmployeeID = ?';
  db.query(sql, [updatedEmployee, employeeId], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).send('Error updating employee');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Employee not found');
    }
    res.send('Employee updated');
  });
};

// DELETE an employee by EmployeeID
exports.deleteEmployee = (req, res) => {
    const employeeId = req.params.id;

    // First, delete any associated feedback entries for quotes made by this employee
    const deleteFeedbackQuery = `
        DELETE Feedback FROM Feedback
        JOIN Quotes ON Feedback.ProjectID = Quotes.QuoteID
        WHERE Quotes.EmployeeID = ?;
    `;

    db.query(deleteFeedbackQuery, [employeeId], (err) => {
        if (err) {
            console.error('Error deleting feedback:', err);
            return res.status(500).send('Error deleting feedback');
        }

        // Now, delete the quote entries related to the employee
        const deleteQuoteQuery = `DELETE FROM Quotes WHERE EmployeeID = ?;`;

        db.query(deleteQuoteQuery, [employeeId], (err) => {
            if (err) {
                console.error('Error deleting quotes:', err);
                return res.status(500).send('Error deleting quotes');
            }

            // Finally, delete the employee
            const deleteEmployeeQuery = `DELETE FROM Employee WHERE EmployeeID = ?;`;

            db.query(deleteEmployeeQuery, [employeeId], (err, result) => {
                if (err) {
                    console.error('Error deleting employee:', err);
                    return res.status(500).send('Error deleting employee');
                }
                if (result.affectedRows === 0) {
                    return res.status(404).send('Employee not found');
                }
                res.send('Employee and associated quotes and feedback deleted successfully');
            });
        });
    });
};

