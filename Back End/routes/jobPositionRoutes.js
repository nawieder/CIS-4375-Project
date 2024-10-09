const express = require('express');
const router = express.Router();
const jobPositionController = require('../controllers/jobPositionController');

// GET all job positions
router.get('/', jobPositionController.getAllPositions);

// GET a specific job position by ID
router.get('/:id', jobPositionController.getPositionById);

// POST a new job position
router.post('/', jobPositionController.createPosition);

// PUT to update a job position by ID
router.put('/:id', jobPositionController.updatePosition);

// DELETE a job position by ID
router.delete('/:id', jobPositionController.deletePosition);

module.exports = router;
