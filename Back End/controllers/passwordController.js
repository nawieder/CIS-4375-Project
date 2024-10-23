const db = require('../config/db');

// GET all passwords
exports.getAllPasswords = (req, res) => {
  const sql = 'SELECT * FROM Passwords';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching passwords:', err);
      return res.status(500).send('Error fetching passwords');
    }
    res.json(results);
  });
};

// GET a specific password by CustomerID
exports.getPasswordByCustomerId = (req, res) => {
  const customerId = req.params.id;
  const sql = 'SELECT * FROM Passwords WHERE CustomerID = ?';
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error('Error fetching password:', err);
      return res.status(500).send('Error fetching password');
    }
    if (result.length === 0) {
      return res.status(404).send('Password not found');
    }
    res.json(result[0]);
  });
};

// POST a new password
exports.createPassword = (req, res) => {
  const newPassword = req.body;
  const sql = 'INSERT INTO Passwords SET ?';
  db.query(sql, newPassword, (err, result) => {
    if (err) {
      console.error('Error adding password:', err);
      return res.status(500).send('Error adding password');
    }
    res.json({ message: 'Password created' });
  });
};

// PUT to update a password
exports.updatePassword = (req, res) => {
  const customerId = req.params.id;
  const updatedPassword = req.body;
  const sql = 'UPDATE Passwords SET ? WHERE CustomerID = ?';
  db.query(sql, [updatedPassword, customerId], (err, result) => {
    if (err) {
      console.error('Error updating password:', err);
      return res.status(500).send('Error updating password');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Password not found');
    }
    res.send('Password updated');
  });
};

// DELETE a password by CustomerID
exports.deletePassword = (req, res) => {
  const customerId = req.params.id;
  const sql = 'DELETE FROM Passwords WHERE CustomerID = ?';
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error('Error deleting password:', err);
      return res.status(500).send('Error deleting password');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Password not found');
    }
    res.send('Password deleted');
  });
};
