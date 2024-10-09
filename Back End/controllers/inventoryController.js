// Back End/controllers/inventoryController.js
const db = require('../config/db');

// GET all inventory items
exports.getAllInventory = (req, res) => {
  const sql = 'SELECT * FROM Inventory';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching inventory:', err);
      return res.status(500).send('Error fetching inventory');
    }
    res.json(results);
  });
};

// GET a specific inventory item by InventoryID
exports.getInventoryById = (req, res) => {
  const inventoryId = req.params.id;
  const sql = 'SELECT * FROM Inventory WHERE InventoryID = ?';
  db.query(sql, [inventoryId], (err, result) => {
    if (err) {
      console.error('Error fetching inventory item:', err);
      return res.status(500).send('Error fetching inventory item');
    }
    res.json(result[0]);
  });
};

// POST a new inventory item
exports.createInventoryItem = (req, res) => {
  const newItem = req.body;
  const sql = 'INSERT INTO Inventory SET ?';
  db.query(sql, newItem, (err, result) => {
    if (err) {
      console.error('Error adding inventory item:', err);
      return res.status(500).send('Error adding inventory item');
    }
    res.json({ message: 'Inventory item created', itemId: result.insertId });
  });
};

// PUT to update an inventory item
exports.updateInventoryItem = (req, res) => {
  const inventoryId = req.params.id;
  const updatedItem = req.body;
  const sql = 'UPDATE Inventory SET ? WHERE InventoryID = ?';
  db.query(sql, [updatedItem, inventoryId], (err, result) => {
    if (err) {
      console.error('Error updating inventory item:', err);
      return res.status(500).send('Error updating inventory item');
    }
    res.send('Inventory item updated');
  });
};

// DELETE an inventory item by InventoryID
exports.deleteInventoryItem = (req, res) => {
  const inventoryId = req.params.id;
  const sql = 'DELETE FROM Inventory WHERE InventoryID = ?';
  db.query(sql, [inventoryId], (err, result) => {
    if (err) {
      console.error('Error deleting inventory item:', err);
      return res.status(500).send('Error deleting inventory item');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Inventory item not found');
    }
    res.send('Inventory item deleted');
  });
};
