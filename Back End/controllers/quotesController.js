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
    if (result.length === 0) {
      return res.status(404).send('Quote not found');
    }
    res.json(result[0]);
  });
};

// POST a new quote
exports.createQuote = (req, res) => {
  const { CustomerID, EmployeeID, QuoteDate, TotalAmount, Status, PaymentStatus, PaymentMethod, EndDate, ProjectTotalCost } = req.body;

  // Ensure all required fields are included
  if (!CustomerID || !EmployeeID || !QuoteDate || !TotalAmount || !Status || !PaymentStatus) {
    return res.status(400).send('Missing required fields');
  }

  // Check if CustomerID and EmployeeID exist in their respective tables
  const checkCustomerSql = 'SELECT * FROM Customer WHERE CustomerID = ?';
  const checkEmployeeSql = 'SELECT * FROM Employee WHERE EmployeeID = ?';

  db.query(checkCustomerSql, [CustomerID], (customerErr, customerResult) => {
    if (customerErr) {
      console.error('Error checking CustomerID:', customerErr);
      return res.status(500).send('Error checking customer');
    }
    if (customerResult.length === 0) {
      return res.status(400).send('CustomerID does not exist');
    }

    db.query(checkEmployeeSql, [EmployeeID], (employeeErr, employeeResult) => {
      if (employeeErr) {
        console.error('Error checking EmployeeID:', employeeErr);
        return res.status(500).send('Error checking employee');
      }
      if (employeeResult.length === 0) {
        return res.status(400).send('EmployeeID does not exist');
      }

      // Proceed to insert the new quote if both CustomerID and EmployeeID exist
      const newQuote = { CustomerID, EmployeeID, QuoteDate, TotalAmount, Status, PaymentStatus, PaymentMethod, EndDate, ProjectTotalCost };
      const sql = 'INSERT INTO Quotes SET ?';

      db.query(sql, newQuote, (err, result) => {
        if (err) {
          console.error('Error creating quote:', err);
          return res.status(500).send('Error creating quote');
        }
        res.json({ message: 'Quote created', quoteId: result.insertId });
      });
    });
  });
};

// PUT to update a quote (e.g., status, payment info)
exports.updateQuote = (req, res) => {
  const quoteId = req.params.id;
  const { Status, PaymentStatus, PaymentMethod, EndDate, ProjectTotalCost, TotalAmount } = req.body;

  const updatedQuote = { Status, PaymentStatus, PaymentMethod, EndDate, ProjectTotalCost, TotalAmount };
  const sql = 'UPDATE Quotes SET ? WHERE QuoteID = ?';

  db.query(sql, [updatedQuote, quoteId], (err, result) => {
    if (err) {
      console.error('Error updating quote:', err);
      return res.status(500).send('Error updating quote');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Quote not found');
    }
    res.json({ message: 'Quote updated' });
  });
};

// DELETE a quote by QuoteID
exports.deleteQuote = (req, res) => {
  const quoteId = req.params.id;

  // Delete associated feedback entries first
  const deleteFeedbackSql = 'DELETE FROM Feedback WHERE ProjectID = ?';
  db.query(deleteFeedbackSql, [quoteId], (feedbackErr, feedbackResult) => {
    if (feedbackErr) {
      console.error('Error deleting related feedback:', feedbackErr);
      return res.status(500).send('Error deleting related feedback');
    }

    // Proceed to delete the quote
    const deleteQuoteSql = 'DELETE FROM Quotes WHERE QuoteID = ?';
    db.query(deleteQuoteSql, [quoteId], (quoteErr, quoteResult) => {
      if (quoteErr) {
        console.error('Error deleting quote:', quoteErr);
        return res.status(500).send('Error deleting quote');
      }
      if (quoteResult.affectedRows === 0) {
        return res.status(404).send('Quote not found');
      }
      res.send('Quote and related feedback deleted');
    });
  });
};

