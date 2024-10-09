// Back End/routes/quotesRoutes.js
const express = require('express');
const router = express.Router();
const quotesController = require('../controllers/quotesController');

// Define Quotes Routes
router.get('/', quotesController.getAllQuotes);
router.get('/:id', quotesController.getQuoteById);
router.post('/', quotesController.createQuote);
router.put('/:id', quotesController.updateQuote);
router.delete('/:id', quotesController.deleteQuote);

module.exports = router;
