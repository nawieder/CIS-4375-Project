// controllers/jobStatusController.js
const db = require('../config/db');

exports.getJobStatus = (req, res) => {
    const { quoteRef, email } = req.body;
    
    // Adjust this query based on your actual database schema
    const sql = 'SELECT * FROM Quotes WHERE QuoteID = ? AND CustomerEmail = ?';
    
    db.query(sql, [quoteRef, email], (err, result) => {
        if (err) {
            console.error('Error fetching job status:', err);
            return res.status(500).send('Error fetching job status');
        }
        if (result.length === 0) {
            return res.status(404).send('Job not found');
        }
        
        const job = result[0];
        res.json({
            customerName: job.CustomerName,
            jobAddress: job.JobAddress,
            jobType: job.JobType,
            status: job.Status
        });
    });
};