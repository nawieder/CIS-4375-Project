// quotes.js

const express = require('express');
const router = express.Router();

// MySQL connection is imported from the server
module.exports = (db) => {
  // 1. GET /quotes - Fetch all quotes
  router.get('/', (req, res) => {
    const sql = 'SELECT * FROM Quotes';
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  });

  // 2. GET /quotes/:id - Fetch a specific quote by QuoteID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM Quotes WHERE QuoteID = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'Quote not found' });
      }
      res.json(result[0]);
    });
  });

  // 3. POST /quotes - Create a new quote
  router.post('/', (req, res) => {
    const { CustomerID, TotalAmount, Status } = req.body;

    if (!CustomerID || !TotalAmount) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    const sql = 'INSERT INTO Quotes (CustomerID, TotalAmount, Status) VALUES (?, ?, ?)';
    const values = [CustomerID, TotalAmount, Status];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Quote created', QuoteID: result.insertId });
    });
  });

  // 4. PUT /quotes/:id - Update a quote
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { CustomerID, TotalAmount, Status } = req.body;

    const sql = 'UPDATE Quotes SET CustomerID = ?, TotalAmount = ?, Status = ? WHERE QuoteID = ?';
    const values = [CustomerID, TotalAmount, Status, id];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Quote not found' });
      }
      res.json({ message: 'Quote updated' });
    });
  });

  // 5. DELETE /quotes/:id - Delete a quote
  router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM Quotes WHERE QuoteID = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Quote not found' });
      }
      res.json({ message: 'Quote deleted' });
    });
  });

  return router;
};