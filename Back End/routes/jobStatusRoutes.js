// routes/jobStatusRoutes.js
const express = require('express');
const router = express.Router();
const jobStatusController = require('../controllers/jobStatusController');

router.post('/api/job-status', jobStatusController.getJobStatus);

module.exports = router;