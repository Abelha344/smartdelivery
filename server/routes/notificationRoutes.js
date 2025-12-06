
const express = require('express');
const router = express.Router();
const { sendConfirmationSMS } = require('../controllers/notificationController');

router.post('/sms', sendConfirmationSMS);

module.exports = router;
