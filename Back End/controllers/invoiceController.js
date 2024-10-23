const db = require('../config/db');

// GET all invoices
exports.getAllInvoices = (req, res) => {
  const sql = 'SELECT * FROM Invoice';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching invoices:', err);
      return res.status(500).send('Error fetching invoices');
    }
    res.json(results);
  });
};

// GET a specific invoice by InvoiceID
exports.getInvoiceById = (req, res) => {
  const invoiceId = req.params.id;
  const sql = 'SELECT * FROM Invoice WHERE InvoiceID = ?';
  db.query(sql, [invoiceId], (err, result) => {
    if (err) {
      console.error('Error fetching invoice:', err);
      return res.status(500).send('Error fetching invoice');
    }
    if (result.length === 0) {
      return res.status(404).send('Invoice not found');
    }
    res.json(result[0]);
  });
};

// POST a new invoice
exports.createInvoice = (req, res) => {
  const newInvoice = req.body;
  const sql = 'INSERT INTO Invoice SET ?';
  db.query(sql, newInvoice, (err, result) => {
    if (err) {
      console.error('Error adding invoice:', err);
      return res.status(500).send('Error adding invoice');
    }
    res.json({ message: 'Invoice created', invoiceId: result.insertId });
  });
};

// PUT to update an invoice
exports.updateInvoice = (req, res) => {
  const invoiceId = req.params.id;
  const updatedInvoice = req.body;
  const sql = 'UPDATE Invoice SET ? WHERE InvoiceID = ?';
  db.query(sql, [updatedInvoice, invoiceId], (err, result) => {
    if (err) {
      console.error('Error updating invoice:', err);
      return res.status(500).send('Error updating invoice');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Invoice not found');
    }
    res.send('Invoice updated');
  });
};

// DELETE an invoice by InvoiceID
exports.deleteInvoice = (req, res) => {
  const invoiceId = req.params.id;
  const sql = 'DELETE FROM Invoice WHERE InvoiceID = ?';
  db.query(sql, [invoiceId], (err, result) => {
    if (err) {
      console.error('Error deleting invoice:', err);
      return res.status(500).send('Error deleting invoice');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Invoice not found');
    }
    res.send('Invoice deleted');
  });
};
