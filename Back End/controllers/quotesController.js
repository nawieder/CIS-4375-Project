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
  const { CustomerID, QuoteDate, TotalAmount, Status, EmailSent, Completed } = req.body;

  // Ensure all required fields are included
  if (!CustomerID || !QuoteDate || !TotalAmount || !Status || EmailSent === undefined || Completed === undefined) {
    return res.status(400).send('Missing required fields');
  }

  // Check if CustomerID exists
  const checkCustomerSql = 'SELECT * FROM Customer WHERE CustomerID = ?';
  db.query(checkCustomerSql, [CustomerID], (customerErr, customerResult) => {
    if (customerErr) {
      console.error('Error checking CustomerID:', customerErr);
      return res.status(500).send('Error checking customer');
    }
    if (customerResult.length === 0) {
      return res.status(400).send('CustomerID does not exist');
    }

    // Proceed to insert the new quote if CustomerID exists
    const newQuote = { CustomerID, QuoteDate, TotalAmount, Status, EmailSent, Completed };
    const sql = 'INSERT INTO Quotes SET ?';

    db.query(sql, newQuote, (err, result) => {
      if (err) {
        console.error('Error creating quote:', err);
        return res.status(500).send('Error creating quote');
      }
      res.json({ message: 'Quote created', quoteId: result.insertId });
    });
  });
};



// PUT to update a quote (e.g., status, payment info)
exports.updateQuote = (req, res) => {
  const quoteId = req.params.id;
  const { Status, TotalAmount } = req.body;

  // Ensure required fields are present
  if (!TotalAmount || !Status) {
    return res.status(400).send('Missing required fields');
  }

  const sql = 'UPDATE Quotes SET `Status` = ?, `TotalAmount` = ? WHERE QuoteID = ?';
  db.query(sql, [Status, TotalAmount, quoteId], (err, result) => {
    if (err) {
      console.error('Error updating quote:', err);
      return res.status(500).send('Error updating quote');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Quote not found');
    }
    res.send('Quote updated');
  });
};




// DELETE a quote by QuoteID (with invoice and payment deletion)
// DELETE a quote by QuoteID and associated projects, invoices, and payments
exports.deleteQuote = (req, res) => {
  const quoteId = req.params.id;

  // Promise wrapper for DB queries
  const queryDb = (sql, params) => {
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };

  // Start by deleting any associated projects
  queryDb('DELETE FROM Projects WHERE QuoteID = ?', [quoteId])
    .then(() => {
      // Retrieve InvoiceID(s) associated with the QuoteID
      return queryDb('SELECT InvoiceID FROM Invoice WHERE QuoteID = ?', [quoteId]);
    })
    .then((invoiceResult) => {
      const invoiceIds = invoiceResult.map((row) => row.InvoiceID);

      // If no invoices are found, delete the quote directly
      if (invoiceIds.length === 0) {
        return queryDb('DELETE FROM Quotes WHERE QuoteID = ?', [quoteId]);
      } else {
        // Delete associated payments first
        return queryDb('DELETE FROM Payments WHERE InvoiceID IN (?)', [invoiceIds])
          .then(() => {
            // Delete invoices after payments
            return queryDb('DELETE FROM Invoice WHERE QuoteID = ?', [quoteId]);
          })
          .then(() => {
            // Finally, delete the quote
            return queryDb('DELETE FROM Quotes WHERE QuoteID = ?', [quoteId]);
          });
      }
    })
    .then((result) => {
      if (result.affectedRows === 0) {
        return res.status(404).send('Quote not found');
      }
      res.send('Quote, related projects, invoices, and payments deleted');
    })
    .catch((err) => {
      console.error('Error deleting quote:', err);
      res.status(500).send('Error deleting quote and related records');
    });
};



