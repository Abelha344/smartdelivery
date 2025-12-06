const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { items, totalPrice, deliveryAddress, paymentMethod, userPhone } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const order = new Order({
    userId: req.user._id,
    userName: req.user.fullName,
    userPhone: userPhone || req.user.phone, // Use provided phone or fallback to user profile phone
    items,
    totalPrice,
    deliveryAddress,
    paymentMethod
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  // Populate deliveryPersonId with fullName and phone so client can see driver info
  const orders = await Order.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('deliveryPersonId', 'fullName phone'); 
  res.status(200).json(orders);
};

// @desc    Get all orders (Admin/Delivery)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  // Simple check - in real app would be more robust role check
  if (req.user.role === 'CLIENT') {
     return res.status(401).json({ message: 'Not authorized' });
  }
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.status(200).json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Delivery)
const updateOrderStatus = async (req, res) => {
  const { status, deliveryPersonId } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    if (status) order.status = status;
    if (deliveryPersonId) order.deliveryPersonId = deliveryPersonId;
    
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus
};





































