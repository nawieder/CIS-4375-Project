const mysql = require('mysql2');

// MySQL connection
const db = mysql.createConnection({
  host: 'bluerynodb.cj02o08agyaa.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'BlueRynoProjectDB',
});

// GET all job positions
exports.getAllPositions = (req, res) => {
  const sql = 'SELECT * FROM JobPosition';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send('Error fetching job positions');
    res.json(results);
  });
};

// GET a specific job position by ID
exports.getPositionById = (req, res) => {
  const positionId = req.params.id;
  const sql = 'SELECT * FROM JobPosition WHERE PositionID = ?';
  db.query(sql, [positionId], (err, result) => {
    if (err) return res.status(500).send('Error fetching job position');
    res.json(result);
  });
};

// POST a new job position
exports.createPosition = (req, res) => {
  const newPosition = req.body;
  const sql = 'INSERT INTO JobPosition SET ?';
  db.query(sql, newPosition, (err, result) => {
    if (err) return res.status(500).send('Error adding job position');
    res.json({ message: 'Job position created', positionId: result.insertId });
  });
};

// PUT to update a job position by ID
exports.updatePosition = (req, res) => {
  const positionId = req.params.id;
  const updatedPosition = req.body;
  const sql = 'UPDATE JobPosition SET ? WHERE PositionID = ?';
  db.query(sql, [updatedPosition, positionId], (err, result) => {
    if (err) return res.status(500).send('Error updating job position');
    res.json({ message: 'Job position updated' });
  });
};

// DELETE a job position by ID
exports.deletePosition = (req, res) => {
  const positionId = req.params.id;

  // Step 1: Delete feedback associated with quotes for employees with the specified PositionID
  const deleteFeedback = `
    DELETE Feedback FROM Feedback
    JOIN Quotes ON Feedback.ProjectID = Quotes.QuoteID
    JOIN Employee ON Quotes.EmployeeID = Employee.EmployeeID
    WHERE Employee.PositionID = ?`;
  
  db.query(deleteFeedback, [positionId], (err) => {
    if (err) {
      console.error('Error deleting feedback:', err);
      return res.status(500).send('Error deleting feedback');
    }

    // Step 2: Delete quotes associated with employees with the specified PositionID
    const deleteQuotes = `
      DELETE Quotes FROM Quotes
      JOIN Employee ON Quotes.EmployeeID = Employee.EmployeeID
      WHERE Employee.PositionID = ?`;
    
    db.query(deleteQuotes, [positionId], (err) => {
      if (err) {
        console.error('Error deleting quotes:', err);
        return res.status(500).send('Error deleting quotes');
      }

      // Step 3: Delete payroll records for employees with the specified PositionID
      const deletePayroll = `
        DELETE Payroll FROM Payroll
        JOIN Employee ON Payroll.EmployeeID = Employee.EmployeeID
        WHERE Employee.PositionID = ?`;

      db.query(deletePayroll, [positionId], (err) => {
        if (err) {
          console.error('Error deleting payroll records:', err);
          return res.status(500).send('Error deleting payroll records');
        }

        // Step 4: Delete employees with the specified PositionID
        const deleteEmployees = 'DELETE FROM Employee WHERE PositionID = ?';
        db.query(deleteEmployees, [positionId], (err) => {
          if (err) {
            console.error('Error deleting employees:', err);
            return res.status(500).send('Error deleting employees');
          }

          // Step 5: Delete the job position itself
          const deletePosition = 'DELETE FROM JobPosition WHERE PositionID = ?';
          db.query(deletePosition, [positionId], (err, result) => {
            if (err) {
              console.error('Error deleting job position:', err);
              return res.status(500).send('Error deleting job position');
            }
            if (result.affectedRows === 0) {
              return res.status(404).send('Job position not found');
            }
            res.send('Job position and associated feedback, quotes, payroll records, and employees deleted');
          });
        });
      });
    });
  });
};
