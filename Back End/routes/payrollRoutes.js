// Back End/routes/payrollRoutes.js
const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

// Define Payroll Routes
router.get('/', payrollController.getAllPayrollEntries);
router.get('/:id', payrollController.getPayrollById);
router.post('/', payrollController.createPayrollEntry);
router.put('/:id', payrollController.updatePayrollEntry);
router.delete('/:id', payrollController.deletePayrollEntry);

module.exports = router;
