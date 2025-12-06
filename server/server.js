
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const os = require('os');

// 1. Config Environment First
dotenv.config();

// Default JWT Secret if missing
if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is not defined. Using default secret for development.");
  process.env.JWT_SECRET = 'dev_secret_key_123';
}

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middleware
app.use(cors({
  origin: true, 
  credentials: true
}));

// Increased limits for image uploads (100mb to handle large base64 strings)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// DEBUG: Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health Check
app.get('/', (req, res) => {
  res.send('MDS Backend API is running');
});

// 4. Import Routes
// Importing here ensures all env vars and DB connections are ready
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// 5. Mount Routes
// Specific routes first
app.use('/api/auth', authRoutes);

// Payment Routes - Logging for debug
console.log('Mounting Payment Routes...');
app.use('/api/payment', paymentRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

// Generic Data Routes (last as it mounts to /api)
app.use('/api', dataRoutes);

// 404 Handler for API Routes (Force JSON response)
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: `API Route Not Found: ${req.method} ${req.originalUrl}` });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  // Handle PayloadTooLargeError specifically for better debugging
  if (err.type === 'entity.too.large') {
      res.status(413).json({ message: 'File too large. Please upload a smaller image.' });
      return;
  }
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Helper to find local IP
const getLocalIp = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

app.listen(PORT, () => {
    const ip = getLocalIp();
    console.log(`Server started on port ${PORT}`);
    console.log(`> Local:   http://localhost:${PORT}`);
    console.log(`> Network: http://${ip}:${PORT} (Use this for Mobile testing)`);
});
