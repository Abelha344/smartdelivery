
// @desc    Send Transaction Confirmation SMS
// @route   POST /api/notifications/sms
// @access  Public (Protected by context in real app, keeping open for callback flow)
const sendConfirmationSMS = async (req, res) => {
  const { phone, orderId, customerName } = req.body;

  // In a production environment, you would integrate with a provider like Twilio, Africa's Talking, or a local Ethiopian SMS gateway.
  // For this requirement, we simulate the logic and log it.

  console.log(`[SMS SERVICE] Dispatching to ${phone}...`);
  console.log(`[SMS CONTENT] "Thank you for your order! Your payment for Order #${orderId} has been confirmed. Get ready for delicious food!"`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  res.status(200).json({ 
    success: true, 
    message: 'SMS sent successfully' 
  });
};

module.exports = {
  sendConfirmationSMS
};
