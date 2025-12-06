
const express = require('express');
const router = express.Router();
const { initializeChapa, verifyChapa } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Debug Logging
if (!initializeChapa) {
    console.error("CRITICAL ERROR: initializeChapa controller is undefined. Check paymentController.js exports.");
}

router.post('/chapa/initialize', protect, initializeChapa);
router.get('/chapa/verify/:tx_ref', verifyChapa);

console.log("Payment Routes Loaded Successfully");

module.exports = router;
