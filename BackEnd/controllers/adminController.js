// controllers/adminController.js
const db = require('../config/db');

const adminController = {
    // Login handling
    login: async (req, res) => {
        const { username, password } = req.body;
        try {
            // In production, you should use proper password hashing
            const [admin] = await db.query(
                'SELECT * FROM Admins WHERE username = ? AND password = ?',
                [username, password]
            );

            if (admin.length > 0) {
                // Set admin session
                req.session.isAdmin = true;
                req.session.adminId = admin[0].id;
                res.json({ success: true, message: 'Login successful' });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Logout
    logout: (req, res) => {
        req.session.destroy();
        res.json({ success: true, message: 'Logged out successfully' });
    },

    // Get active jobs for admin dashboard
    getActiveJobs: async (req, res) => {
        try {
            const [jobs] = await db.query(`
                SELECT q.QuoteID, q.CustomerID, c.FirstName, c.LastName, 
                       q.QuoteDate, q.TotalAmount, q.Status,
                       q.MaterialType, q.FenceLength
                FROM Quotes q
                JOIN Customers c ON q.CustomerID = c.CustomerID
                WHERE q.Status = 'Active'
                ORDER BY q.QuoteDate DESC
            `);
            res.json(jobs);
        } catch (error) {
            console.error('Error fetching active jobs:', error);
            res.status(500).json({ success: false, message: 'Error fetching active jobs' });
        }
    },

    // Get completed jobs
    getCompletedJobs: async (req, res) => {
        try {
            const [jobs] = await db.query(`
                SELECT q.QuoteID, q.CustomerID, c.FirstName, c.LastName,
                       i.InvoiceID, i.TotalAmount, i.PaymentStatus,
                       q.MaterialType, q.FenceLength
                FROM Quotes q
                JOIN Customers c ON q.CustomerID = c.CustomerID
                JOIN Invoice i ON q.QuoteID = i.QuoteID
                WHERE q.Status = 'Completed'
                ORDER BY i.InvoiceDate DESC
            `);
            res.json(jobs);
        } catch (error) {
            console.error('Error fetching completed jobs:', error);
            res.status(500).json({ success: false, message: 'Error fetching completed jobs' });
        }
    },

    // Update job status
    updateJobStatus: async (req, res) => {
        const { quoteId, status } = req.body;
        try {
            await db.query('UPDATE Quotes SET Status = ? WHERE QuoteID = ?', [status, quoteId]);
            
            // If marking as completed, create invoice
            if (status === 'Completed') {
                const [quote] = await db.query('SELECT * FROM Quotes WHERE QuoteID = ?', [quoteId]);
                if (quote.length > 0) {
                    await db.query(`
                        INSERT INTO Invoice (QuoteID, InvoiceDate, DueDate, TotalAmount, PaymentStatus)
                        VALUES (?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), ?, 'Pending')
                    `, [quoteId, quote[0].TotalAmount]);
                }
            }
            
            res.json({ success: true, message: 'Job status updated successfully' });
        } catch (error) {
            console.error('Error updating job status:', error);
            res.status(500).json({ success: false, message: 'Error updating job status' });
        }
    },

    // Dashboard summary
    getDashboardSummary: async (req, res) => {
        try {
            const [summary] = await db.query(`
                SELECT 
                    (SELECT COUNT(*) FROM Quotes WHERE Status = 'Active') as activeJobs,
                    (SELECT COUNT(*) FROM Quotes WHERE Status = 'Completed') as completedJobs,
                    (SELECT COUNT(*) FROM Invoice WHERE PaymentStatus = 'Pending') as pendingPayments,
                    (SELECT SUM(TotalAmount) FROM Invoice WHERE PaymentStatus = 'Paid') as totalRevenue
            `);
            res.json(summary[0]);
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            res.status(500).json({ success: false, message: 'Error fetching dashboard summary' });
        }
    }
};

module.exports = adminController;