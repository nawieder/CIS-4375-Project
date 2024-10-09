// Back End/controllers/payrollController.js
const db = require('../config/db');

// GET all payroll entries
exports.getAllPayrollEntries = (req, res) => {
  const sql = 'SELECT * FROM Payroll';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching payroll entries:', err);
      return res.status(500).send('Error fetching payroll entries');
    }
    res.json(results);
  });
};

// GET a specific payroll entry by PayrollID
exports.getPayrollById = (req, res) => {
  const payrollId = req.params.id;
  const sql = 'SELECT * FROM Payroll WHERE PayrollID = ?';
  db.query(sql, [payrollId], (err, result) => {
    if (err) {
      console.error('Error fetching payroll entry:', err);
      return res.status(500).send('Error fetching payroll entry');
    }
    res.json(result[0]);
  });
};

// POST a new payroll entry
exports.createPayrollEntry = (req, res) => {
  const newEntry = req.body;
  const sql = 'INSERT INTO Payroll SET ?';
  db.query(sql, newEntry, (err, result) => {
    if (err) {
      console.error('Error adding payroll entry:', err);
      return res.status(500).send('Error adding payroll entry');
    }
    res.json({ message: 'Payroll entry created', payrollId: result.insertId });
  });
};

// PUT to update a payroll entry
exports.updatePayrollEntry = (req, res) => {
  const payrollId = req.params.id;
  const updatedEntry = req.body;
  const sql = 'UPDATE Payroll SET ? WHERE PayrollID = ?';
  db.query(sql, [updatedEntry, payrollId], (err, result) => {
    if (err) {
      console.error('Error updating payroll entry:', err);
      return res.status(500).send('Error updating payroll entry');
    }
    res.json({ message: 'Payroll entry updated' });
  });
};

// DELETE a payroll entry by PayrollID
exports.deletePayrollEntry = (req, res) => {
  const payrollId = req.params.id;
  const sql = 'DELETE FROM Payroll WHERE PayrollID = ?';
  db.query(sql, [payrollId], (err, result) => {
    if (err) {
      console.error('Error deleting payroll entry:', err);
      return res.status(500).send('Error deleting payroll entry');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Payroll entry not found');
    }
    res.send('Payroll entry deleted');
  });
};
