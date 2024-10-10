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
  const { EmployeeID, PayDate, PayTypes, GrossPay } = req.body;

  // Check for required fields
  if (!EmployeeID || !PayDate || !PayTypes || !GrossPay) {
    return res.status(400).send('Missing required fields');
  }

  const sql = 'INSERT INTO Payroll SET ?';
  const newPayrollEntry = { EmployeeID, PayDate, PayTypes, GrossPay };
  
  db.query(sql, newPayrollEntry, (err, result) => {
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
  const { GrossPay, PayTypes, PayDate } = req.body; // Assuming you want to update these columns

  // Check that there are fields to update
  const updatedFields = {};
  if (GrossPay) updatedFields.GrossPay = GrossPay;
  if (PayTypes) updatedFields.PayTypes = PayTypes;
  if (PayDate) updatedFields.PayDate = PayDate;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).send('No fields to update');
  }

  const sql = 'UPDATE Payroll SET ? WHERE PayrollID = ?';
  db.query(sql, [updatedFields, payrollId], (err, result) => {
    if (err) {
      console.error('Error updating payroll entry:', err);
      return res.status(500).send('Error updating payroll entry');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Payroll entry not found');
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
