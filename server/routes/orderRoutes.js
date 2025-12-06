
const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Define routes
router.route('/')
    .post(protect, createOrder)
    .get(protect, getOrders);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id/status')
    .put(protect, updateOrderStatus);

// Explicit export
module.exports = router;
