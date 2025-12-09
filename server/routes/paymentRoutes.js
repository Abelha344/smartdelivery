
// const express = require('express');
// const router = express.Router();
// const { initializeChapa, verifyChapa } = require('../controllers/paymentController');
// const { protect } = require('../middleware/authMiddleware');

// // Debug Logging
// if (!initializeChapa) {
//     console.error("CRITICAL ERROR: initializeChapa controller is undefined. Check paymentController.js exports.");
// }

// router.post('/chapa/initialize', protect, initializeChapa);
// router.get('/chapa/verify/:tx_ref', verifyChapa);

// console.log("Payment Routes Loaded Successfully");

// module.exports = router;












const express = require('express');
const router = express.Router();

// 1. ISOLATE THE CONTROLLER IMPORT
let paymentControllers;
try {
    // Attempt to import the file. If the path or the file itself is broken, 
    // the error will be caught here immediately.
    paymentControllers = require('../controllers/paymentController');
} catch (error) {
    console.error("CRITICAL IMPORT FAILURE: Could not load paymentController.js.");
    console.error("Check the path: '../controllers/paymentController' is correct and the file exists.");
    // Re-throw the error to stop the server from continuing with a missing module
    throw error;
}

const { initializeChapa, verifyChapa } = paymentControllers;
const { protect } = require('../middleware/authMiddleware');

// 2. IMMEDIATE VALIDATION CHECK
if (typeof initializeChapa !== 'function') {
    console.error("CRITICAL ERROR: 'initializeChapa' is missing or not a function.");
    console.error("Check the EXPORT in paymentController.js: module.exports = { initializeChapa, ... }");
    // Throw a specific error to halt execution and clearly identify the problem source
    throw new Error("Route initialization failed: initializeChapa controller is undefined.");
}
if (typeof verifyChapa !== 'function') {
    console.error("CRITICAL ERROR: 'verifyChapa' is missing or not a function.");
    throw new Error("Route initialization failed: verifyChapa controller is undefined.");
}


// 3. Define Routes
router.post('/chapa/initialize', protect, initializeChapa);
router.get('/chapa/verify/:tx_ref', verifyChapa);

console.log("Payment Routes Registered Successfully.");

module.exports = router;