const db = require('../config/db');

// GET all customers
exports.getAllCustomers = (req, res) => {
  const sql = 'SELECT * FROM Customer';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).send('Error fetching customers');
    }
    res.json(results);
  });
};

// GET a specific customer by CustomerID
exports.getCustomerById = (req, res) => {
  const customerId = req.params.id;
  const sql = 'SELECT * FROM Customer WHERE CustomerID = ?';
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error('Error fetching customer:', err);
      return res.status(500).send('Error fetching customer');
    }
    if (result.length === 0) {
      return res.status(404).send('Customer not found');
    }
    res.json(result[0]);
  });
};

// POST a new customer
exports.createCustomer = (req, res) => {
  const { Email, ...newCustomer } = req.body;

  // Check if the email already exists
  const checkEmail = 'SELECT * FROM Customer WHERE Email = ?';
  db.query(checkEmail, [Email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).send('Error checking email');
    }
    if (results.length > 0) {
      return res.status(409).send('Email already exists');
    }

    // Insert the customer if the email is unique
    const sql = 'INSERT INTO Customer SET ?';
    db.query(sql, { Email, ...newCustomer }, (err, result) => {
      if (err) {
        console.error('Error adding customer:', err);
        return res.status(500).send('Error adding customer');
      }
      res.json({ message: 'Customer created', customerId: result.insertId });
    });
  });
};

// PUT to update a customer's information
exports.updateCustomer = (req, res) => {
  const customerId = req.params.id;
  const updatedCustomer = req.body;
  const sql = 'UPDATE Customer SET ? WHERE CustomerID = ?';
  db.query(sql, [updatedCustomer, customerId], (err, result) => {
    if (err) {
      console.error('Error updating customer:', err);
      return res.status(500).send('Error updating customer');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Customer not found');
    }
    res.send('Customer updated');
  });
};

// DELETE a customer by CustomerID
exports.deleteCustomer = (req, res) => {
  const customerId = req.params.id;

  // Step 1: Delete related feedback records
  const deleteFeedback = 'DELETE FROM Feedback WHERE CustomerID = ?';
  db.query(deleteFeedback, [customerId], (err) => {
    if (err) {
      console.error('Error deleting feedback records:', err);
      return res.status(500).send('Error deleting feedback records');
    }

    // Step 2: Delete related quotes records
    const deleteQuotes = 'DELETE FROM Quotes WHERE CustomerID = ?';
    db.query(deleteQuotes, [customerId], (err) => {
      if (err) {
        console.error('Error deleting quotes:', err);
        return res.status(500).send('Error deleting quotes');
      }

      // Step 3: Delete related project details records
      const deleteProjectDetails = 'DELETE FROM ProjectDetails WHERE CustomerID = ?';
      db.query(deleteProjectDetails, [customerId], (err) => {
        if (err) {
          console.error('Error deleting project details:', err);
          return res.status(500).send('Error deleting project details');
        }

        // Step 4: Finally, delete the customer
        const deleteCustomer = 'DELETE FROM Customer WHERE CustomerID = ?';
        db.query(deleteCustomer, [customerId], (err, result) => {
          if (err) {
            console.error('Error deleting customer:', err);
            return res.status(500).send('Error deleting customer');
          }
          if (result.affectedRows === 0) {
            return res.status(404).send('Customer not found');
          }
          res.send('Customer and associated feedback, quotes, and project details deleted');
        });
      });
    });
  });
};

