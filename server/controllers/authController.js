
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('./models/user');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user - Force role to CLIENT
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: 'CLIENT'
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
};

// @desc    Sync Clerk User with Backend (OAuth Login)
// @route   POST /api/auth/sync
// @access  Public
const syncWithClerk = async (req, res) => {
    const { email, fullName, avatar } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email required' });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user from Clerk data
            user = await User.create({
                fullName: fullName || 'Clerk User',
                email: email,
                avatar: avatar,
                role: 'CLIENT' 
                // No password for OAuth users
            });
        }

        // Return standard local JWT logic
        res.status(200).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error("Sync Error:", error);
        res.status(500).json({ message: 'Server Sync Error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user details (Admin)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
const adminUpdateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields if provided
    if (req.body.role) user.role = req.body.role;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.fullName) user.fullName = req.body.fullName;
    
    await user.save();
    
    res.status(200).json({ 
        message: 'User updated', 
        user: { 
            _id: user._id, 
            fullName: user.fullName, 
            email: user.email, 
            role: user.role,
            phone: user.phone
        } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Terminate)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'User terminated successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Backward compatibility (deprecated, use adminUpdateUser)
const updateUserRole = adminUpdateUser;

module.exports = {
  registerUser,
  loginUser,
  syncWithClerk,
  getMe,
  getAllUsers,
  updateUserRole,
  adminUpdateUser,
  deleteUser
};































