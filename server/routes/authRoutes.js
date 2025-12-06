
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, syncWithClerk, getMe, getAllUsers, updateUserRole, adminUpdateUser, deleteUser } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/sync', syncWithClerk); // New OAuth Sync Route
router.get('/me', protect, getMe);

// Admin User Management Routes
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole); // Legacy
router.put('/users/:id', protect, adminOnly, adminUpdateUser); // Comprehensive Update
router.delete('/users/:id', protect, adminOnly, deleteUser); // Terminate User

module.exports = router;