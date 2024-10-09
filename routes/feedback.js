// feedback.js

const express = require('express');
const router = express.Router();

// Export the routes as a function that takes the database connection as an argument
module.exports = (db) => {
  // 1. GET /feedback - Fetch all feedback
  router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Feedback';
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  });

  // 2. GET /feedback/:id - Fetch specific feedback by FeedbackID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM Feedback WHERE FeedbackID = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
      res.json(result[0]);
    });
  });

  // 3. POST /feedback - Submit new feedback
  router.post('/', (req, res) => {
    const { CustomerID, Comments, Rating } = req.body;

    if (!CustomerID || !Comments || !Rating) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    const sql = 'INSERT INTO Feedback (CustomerID, Comments, Rating) VALUES (?, ?, ?)';
    const values = [CustomerID, Comments, Rating];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Feedback submitted', FeedbackID: result.insertId });
    });
  });

  // 4. PUT /feedback/:id - Update feedback
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { CustomerID, Comments, Rating } = req.body;

    const sql = 'UPDATE Feedback SET CustomerID = ?, Comments = ?, Rating = ? WHERE FeedbackID = ?';
    const values = [CustomerID, Comments, Rating, id];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
      res.json({ message: 'Feedback updated' });
    });
  });

  // 5. DELETE /feedback/:id - Delete feedback
  router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM Feedback WHERE FeedbackID = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
      res.json({ message: 'Feedback deleted' });
    });
  });

  return router;
};