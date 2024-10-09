// payroll.js

const express = require('express');
const router = express.Router();

// Export the routes as a function that takes the database connection as an argument
module.exports = (db) => {
  // 1. GET /payroll - Fetch all payroll records
  router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Payroll';
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  });

  // 2. GET /payroll/:id - Fetch specific payroll record by PayrollID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM Payroll WHERE PayrollID = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'Payroll record not found' });
      }
      res.json(result[0]);
    });
  });

  // 3. POST /payroll - Create a new payroll record
  router.post('/', (req, res) => {
    const { EmployeeID, Salary, PayDate } = req.body;

    if (!EmployeeID || !Salary || !PayDate) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    const sql = 'INSERT INTO Payroll (EmployeeID, Salary, PayDate) VALUES (?, ?, ?)';
    const values = [EmployeeID, Salary, PayDate];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Payroll record created', PayrollID: result.insertId });
    });
  });

  // 4. PUT /payroll/:id - Update a payroll record
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { EmployeeID, Salary, PayDate } = req.body;

    const sql = 'UPDATE Payroll SET EmployeeID = ?, Salary = ?, PayDate = ? WHERE PayrollID = ?';
    const values = [EmployeeID, Salary, PayDate, id];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Payroll record not found' });
      }
      res.json({ message: 'Payroll record updated' });
    });
  });

  // 5. DELETE /payroll/:id - Delete a payroll record
  router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM Payroll WHERE PayrollID = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Payroll record not found' });
      }
      res.json({ message: 'Payroll record deleted' });
    });
  });

  return router;
};