// // server/server.js - FINAL VERSION FOR VERCEL DEPLOYMENT
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const mongoose = require('mongoose');

// // 1. Config Environment First
// dotenv.config();

// // Default JWT Secret if missing
// if (!process.env.JWT_SECRET) {
//     console.warn("WARNING: JWT_SECRET is not defined. Using default secret for development.");
//     process.env.JWT_SECRET = 'dev_secret_key_123';
// }

// // Database Connection Logic
// let isConnected = false;

// const connectDB = async () => {
//     if (isConnected) {
//         console.log('Using existing database connection.');
//         return;
//     }

//     try {
//         await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mds');
//         isConnected = true;
//         console.log("MongoDB Connected Successfully.");
//     } catch (err) {
//         console.error("FATAL: MongoDB Connection Error:", err.message);
//         throw err;
//     }
// };

// const app = express();

// // CRITICAL FIX: Middleware to ensure DB connection is made on first request
// app.use(async (req, res, next) => {
//     try {
//         await connectDB();
//         next();
//     } catch (error) {
//         console.error("DB Connection Failed during request:", error);
//         res.status(503).json({
//             message: "Service Unavailable: Database connection failed.",
//             error: error.message
//         });
//     }
// });

// // Middleware
// app.use(cors({
//     origin: true,
//     credentials: true
// }));
// app.use(express.json());

// // Import and use routes
// const authRoutes = require('./routes/authRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// // Mount routes
// app.use('/api/auth', authRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/admin', adminRoutes);

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//     res.status(200).json({
//         status: 'OK',
//         message: 'Server is running',
//         timestamp: new Date().toISOString(),
//         database: isConnected ? 'Connected' : 'Disconnected'
//     });
// });

// // Root endpoint
// app.get('/api', (req, res) => {
//     res.json({
//         message: 'Mekelle Delivery Service API',
//         version: '1.0.0',
//         endpoints: {
//             auth: '/api/auth',
//             orders: '/api/orders',
//             users: '/api/users',
//             admin: '/api/admin',
//             health: '/api/health'
//         }
//     });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(err.status || 500).json({
//         message: err.message || 'Internal Server Error',
//         error: process.env.NODE_ENV === 'development' ? err : {}
//     });
// });

// // 404 handler
// app.use('*', (req, res) => {
//     res.status(404).json({
//         message: 'API endpoint not found',
//         path: req.originalUrl
//     });
// });

// // CRITICAL VERCEL FIX: Export the app for serverless functions
// if (process.env.VERCEL) {
//     // Export for Vercel serverless
//     module.exports = app;
// } else {
//     // Start server locally
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//         console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
//     });
// }





























// server/server.js - FINAL VERSION FOR VERCEL DEPLOYMENT
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// 1. Config Environment First
dotenv.config();

// Default JWT Secret if missing
if (!process.env.JWT_SECRET) {
    console.warn("WARNING: JWT_SECRET is not defined. Using default secret for development.");
    process.env.JWT_SECRET = 'dev_secret_key_123';
}

// Database Connection Logic
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection.');
        return;
    }

    try {
        // NOTE: The MONGO_URI from your .env is used here,
        // which now correctly points to your Atlas database.
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mds');
        isConnected = true;
        console.log("MongoDB Connected Successfully.");
    } catch (err) {
        console.error("FATAL: MongoDB Connection Error:", err.message);
        throw err;
    }
};

const app = express();

// CRITICAL FIX: Middleware to ensure DB connection is made on first request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("DB Connection Failed during request:", error);
        res.status(503).json({
            message: "Service Unavailable: Database connection failed.",
            error: error.message
        });
    }
});

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// =========================================================================
// !!! TEMPORARY FIX: INCLUDED MINIMAL USER/ADMIN ROUTES HERE TO AVOID ERROR !!!
// =========================================================================

// Placeholder for routes that were previously in './routes/userRoutes'
const userRouter = express.Router();
userRouter.get('/profile', (req, res) => {
    res.json({ message: "User profile endpoint is working (Placeholder)." });
});
userRouter.put('/update', (req, res) => {
    res.json({ message: "User update endpoint is working (Placeholder)." });
});

// Placeholder for routes that were previously in './routes/adminRoutes'
const adminRouter = express.Router();
adminRouter.get('/', (req, res) => {
    res.json({ message: "Admin routes are running (Placeholder)." });
});
// =========================================================================


// Import and use routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // <--- FIX: Payment Router Import
// const userRoutes = require('./routes/userRoutes'); // Using local placeholder
// const adminRoutes = require('./routes/adminRoutes'); // Using local placeholder

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRouter);     // Using the local 'userRouter'
app.use('/api/admin', adminRouter);   // Using the local 'adminRouter'
app.use('/api/payment', paymentRoutes); // <--- FIX: Payment Router Mounting

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: isConnected ? 'Connected' : 'Disconnected'
    });
});

// Root endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Mekelle Delivery Service API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            orders: '/api/orders',
            users: '/api/users',
            admin: '/api/admin',
            payment: '/api/payment', // Added for completeness
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'API endpoint not found',
        path: req.originalUrl
    });
});

// CRITICAL VERCEL FIX: Export the app for serverless functions
if (process.env.VERCEL) {
    // Export for Vercel serverless
    module.exports = app;
} else {
    // Start server locally
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}