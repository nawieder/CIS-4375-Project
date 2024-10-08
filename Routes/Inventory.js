// Inventory Routes

// 1. GET /inventory - Fetch all inventory items
app.get('/inventory', (req, res) => {
  const sql = 'SELECT * FROM Inventory';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// 2. GET /inventory/:id - Fetch a specific inventory item by InventoryID
app.get('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Inventory WHERE InventoryID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json(result[0]);
  });
});

// 3. POST /inventory - Add a new inventory item
app.post('/inventory', (req, res) => {
  const { ItemName, Description, QuantityInStock, PricePerUnit, VendorID } = req.body;

  // Simple validation
  if (!ItemName || !PricePerUnit || !QuantityInStock) {
    return res.status(400).json({ message: 'Please provide required fields' });
  }

  const sql = 'INSERT INTO Inventory (ItemName, Description, QuantityInStock, PricePerUnit, VendorID) VALUES (?, ?, ?, ?, ?)';
  const values = [ItemName, Description, QuantityInStock, PricePerUnit, VendorID];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Inventory item added', InventoryID: result.insertId });
  });
});

// 4. PUT /inventory/:id - Update an inventory item
app.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { ItemName, Description, QuantityInStock, PricePerUnit, VendorID } = req.body;

  const sql = 'UPDATE Inventory SET ItemName = ?, Description = ?, QuantityInStock = ?, PricePerUnit = ?, VendorID = ? WHERE InventoryID = ?';
  const values = [ItemName, Description, QuantityInStock, PricePerUnit, VendorID, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item updated' });
  });
});

// 5. DELETE /inventory/:id - Delete an inventory item
app.delete('/inventory/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM Inventory WHERE InventoryID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item deleted' });
  });
});

// Start server and print clickable link
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});