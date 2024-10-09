// Back End/controllers/quotesController.js
const db = require('../config/db');

// GET all quotes
exports.getAllQuotes = (req, res) => {
  const sql = 'SELECT * FROM Quotes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching quotes:', err);
      return res.status(500).send('Error fetching quotes');
    }
    res.json(results);
  });
};

// GET a specific quote by QuoteID
exports.getQuoteById = (req, res) => {
  const quoteId = req.params.id;
  const sql = 'SELECT * FROM Quotes WHERE QuoteID = ?';
  db.query(sql, [quoteId], (err, result) => {
    if (err) {
      console.error('Error fetching quote:', err);
      return res.status(500).send('Error fetching quote');
    }
    res.json(result[0]);
  });
};

// POST a new quote
exports.createQuote = (req, res) => {
  const newQuote = req.body;
  const sql = 'INSERT INTO Quotes SET ?';
  db.query(sql, newQuote, (err, result) => {
    if (err) {
      console.error('Error creating quote:', err);
      return res.status(500).send('Error creating quote');
    }
    res.json({ message: 'Quote created', quoteId: result.insertId });
  });
};

// PUT to update a quote (e.g., status, payment info)
exports.updateQuote = (req, res) => {
  const quoteId = req.params.id;
  const updatedQuote = req.body;
  const sql = 'UPDATE Quotes SET ? WHERE QuoteID = ?';
  db.query(sql, [updatedQuote, quoteId], (err, result) => {
    if (err) {
      console.error('Error updating quote:', err);
      return res.status(500).send('Error updating quote');
    }
    res.json({ message: 'Quote updated' });
  });
};

// DELETE a quote by QuoteID
exports.deleteQuote = (req, res) => {
  const quoteId = req.params.id;
  const sql = 'DELETE FROM Quotes WHERE QuoteID = ?';
  db.query(sql, [quoteId], (err, result) => {
    if (err) {
      console.error('Error deleting quote:', err);
      return res.status(500).send('Error deleting quote');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Quote not found');
    }
    res.send('Quote deleted');
  });
};
