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
};

module.exports = adminController;
