

const axios = require('axios');
const Order = require('../models/Order');

// Chapa Endpoint
const CHAPA_URL = 'https://api.chapa.co/v1/transaction';

// 🚨 ACTION REQUIRED: Use your currently working Chapa Secret Key here.
// The code uses an environment variable first, then falls back to a hardcoded key.
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-4B4BVH7AMf3mZXWfaYqOst1cJftfc1c'; 

// @desc    Initialize Chapa Payment
// @route   POST /api/payment/chapa/initialize
// @access  Private
const initializeChapa = async (req, res) => {
  const { items, totalPrice, deliveryAddress, userInfo } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Generate unique transaction reference
  const tx_ref = `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  try {
    // 1. Dynamic Host Detection
    const protocol = req.protocol;
    const host = req.get('host'); // e.g. '192.168.1.7:5000'
    const BACKEND_URL = `${protocol}://${host}`;
    
    // Capture Frontend Origin
    const clientOrigin = req.get('origin') || 'http://localhost:3000';

    // 2. Sanitize Phone Number
    let rawPhone = userInfo?.phone || req.user.phone || '';
    let phone = rawPhone.toString().replace(/[^0-9]/g, ''); 
    
    if (phone.startsWith('251')) phone = phone.substring(3);
    if (phone.startsWith('0')) phone = phone.substring(1);
    if (phone.length === 9) phone = '0' + phone;
    
    if (phone.length !== 10) {
        console.log(`[Payment] Phone '${rawPhone}' invalid, using fallback.`);
        phone = '0911234567'; 
    }

    // 3. Create Order
    const order = await Order.create({
      userId: req.user._id,
      userName: req.user.fullName,
      userPhone: phone, 
      items,
      totalPrice,
      deliveryAddress,
      paymentMethod: 'Chapa (Telebirr/Bank)',
      status: 'Pending Payment',
      paymentStatus: 'Pending',
      tx_ref
    });

    console.log(`Order created: ${order._id}`);

    // 4. Prepare Payload
    const cleanName = req.user.fullName.replace(/[^a-zA-Z0-9 ]/g, "").split(' ');
    const firstName = cleanName[0] || 'Customer';
    const lastName = cleanName.slice(1).join(' ') || 'User';
    
    const email = (req.user.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.user.email)) 
        ? req.user.email 
        : 'customer@mds-delivery.com';

    // Verify URL with Source param
    const verifyUrl = `${BACKEND_URL}/api/payment/chapa/verify/${tx_ref}?source=${encodeURIComponent(clientOrigin)}`;
    
    console.log(`Redirect Callback set to: ${verifyUrl}`);

    const chapaPayload = {
      amount: totalPrice.toString(),
      currency: 'ETB',
      email: email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      tx_ref: tx_ref,
      callback_url: verifyUrl,
      return_url: verifyUrl,  
      customization: {
        // ✅ The desired title change is applied here
        title: 'Smart Delivery',
        description: `Order ${order._id.toString().slice(-6)}` 
      }
    };
    
    const response = await axios.post(
        `${CHAPA_URL}/initialize`,
        chapaPayload,
        {
            headers: {
                Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 15000 
        }
    );

    if (response.data.status === 'success' && response.data.data.checkout_url) {
        console.log("Chapa Init Success");
        return res.status(200).json({ 
            checkout_url: response.data.data.checkout_url,
            tx_ref: tx_ref 
        });
    } else {
        throw new Error("Chapa API Error: No checkout URL returned");
    }

  } catch (error) {
    console.error('Payment Init Error:', error.message);
    res.status(500).json({ message: 'Payment initialization failed. Please try again.' });
  }
};

// @desc    Verify Chapa Payment
// @route   GET /api/payment/chapa/verify/:tx_ref
// @access  Public (Callback from Chapa)
const verifyChapa = async (req, res) => {
  const { tx_ref } = req.params;
  
  // Fallback Logic for Source
  let source = req.query.source;
  
  // If source is missing (e.g. Chapa stripped it), try Referer or guess based on Host
  if (!source) {
      const host = req.get('host');
      // If host implies a local network IP (e.g. 192.168.1.7:5000), try to assume frontend is on same IP port 3000
      if (host && host.includes(':')) {
          const ip = host.split(':')[0];
          source = `http://${ip}:3000`;
      } else {
          source = 'http://localhost:3000';
      }
      console.warn(`[Payment] Source param missing. Defaulting redirect to: ${source}`);
  } else {
      source = decodeURIComponent(source);
  }
  
  console.log(`Verifying: ${tx_ref}, Returning to: ${source}`);

  const buildRedirect = (status, msg, ordId, amount, date) => {
      const params = new URLSearchParams({ payment: status });
      if(msg) params.append('message', msg);
      if(ordId) params.append('orderId', ordId);
      if(tx_ref) params.append('tx_ref', tx_ref);
      if(amount) params.append('amount', amount);
      if(date) params.append('date', date);
      
      const page = status === 'success' ? 'success' : 'failed';
      return `${source}/payment/${page}?${params.toString()}`;
  };

  try {
    const order = await Order.findOne({ tx_ref });
    if (!order) {
        return res.redirect(buildRedirect('failed', 'OrderNotFound'));
    }

    if (order.paymentStatus === 'Paid') {
        return res.redirect(buildRedirect('success', null, order._id, order.totalPrice, order.createdAt));
    }

    try {
        const response = await axios.get(
            `${CHAPA_URL}/verify/${tx_ref}`,
            { headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` }, timeout: 10000 }
        );

        if (response.data.status === 'success') {
            order.status = 'Pending'; // Confirmed, ready for processing
            order.paymentStatus = 'Paid';
            await order.save();
            console.log("Verified. Redirecting to Receipt.");
            return res.redirect(buildRedirect('success', null, order._id, order.totalPrice, order.createdAt));
        } else {
             // Payment was cancelled or failed at Chapa
             return res.redirect(buildRedirect('failed', 'PaymentNotCompleted'));
        }
    } catch (verifyError) {
        console.warn("Verification API Call failed:", verifyError.message);
        // If the verification call fails, we might still want to check our DB or ask user to contact support
        return res.redirect(buildRedirect('failed', 'VerificationCheckFailed'));
    }

  } catch (error) {
    console.error('Verify Error:', error.message);
    return res.redirect(buildRedirect('failed', 'ServerVerifyError'));
  }
};

module.exports = {
  initializeChapa,
  verifyChapa
};














































