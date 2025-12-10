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




// // ==========================================================
// // 1. MODULE IMPORTS
// // ==========================================================
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');

// // Load environment variables from .env file
// dotenv.config();

// const dbConnect = require('./config/dbConnect');

// // ==========================================================
// // 2. ROUTE IMPORTS (Food routes REMOVED)
// // ==========================================================
// const authRoutes = require('./routes/authRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const restaurantRoutes = require('./routes/restaurantRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');

// // ==========================================================
// // 3. INITIALIZATION
// // ==========================================================
// dbConnect(); // Connect to MongoDB
// const app = express();
// const PORT = process.env.PORT || 5000;

// // ==========================================================
// // 4. CORS CONFIGURATION (FIXED for Local and Deployed)
// // ==========================================================

// // Define all allowed origins for reliable local/deployed behavior
// const allowedOrigins = [
//     // 1. Local Development Frontends (CRITICAL FIX for local errors)
//     'http://localhost:5173', 
//     'http://127.0.0.1:5173',
//     // 2. Deployed Frontend URL (from environment variable)
//     process.env.FRONTEND_URL, // e.g., https://smartdelivery.netlify.app
//     // 3. Deployed Backend URL
//     process.env.BACKEND_URL // e.g., https://smartdelivery-egb4.onrender.com
// ].filter(Boolean);

// console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

// const corsOptions = {
//     origin: (origin, callback) => {
//         // Allow requests with no origin (like mobile apps or curl requests)
//         if (!origin) return callback(null, true); 

//         // Check if the origin is in our allowed list
//         if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
//             callback(null, true);
//         } else {
//             console.warn(`CORS Error: Origin ${origin} not allowed`);
//             callback(new Error(`Origin ${origin} not allowed by CORS`));
//         }
//     },
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // Allow cookies and authentication headers (important for Clerk)
//     optionsSuccessStatus: 204
// };

// app.use(cors(corsOptions));


// // ==========================================================
// // 5. MIDDLEWARE
// // ==========================================================
// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());


// // ==========================================================
// // 6. HEALTH CHECK & ROOT ROUTE
// // ==========================================================
// app.get('/', (req, res) => {
//     res.send(`Smart Delivery API is running on port ${PORT}`);
// });


// // ==========================================================
// // 7. API ROUTES (Food routes REMOVED)
// // ==========================================================
// app.use('/api/auth', authRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/restaurants', restaurantRoutes);
// app.use('/api/notifications', notificationRoutes);


// // ==========================================================
// // 8. ERROR HANDLING MIDDLEWARE
// // ==========================================================
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     const errorMessage = err.message.includes('CORS') ? err.message : (err.message || 'Something broke on the server!');
    
//     res.status(err.statusCode || 500).send({
//         success: false,
//         message: errorMessage
//     });
// });


// // ==========================================================
// // 9. START SERVER
// // ==========================================================
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });








































// // ==========================================================
// // 1. MODULE IMPORTS
// // ==========================================================
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');

// // Load environment variables from .env file
// dotenv.config();

// const dbConnect = require('./config/dbConnect');

// // ==========================================================
// // 2. ROUTE IMPORTS 
// // ==========================================================
// const authRoutes = require('./routes/authRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const restaurantRoutes = require('./routes/restaurantRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');

// // ==========================================================
// // 3. INITIALIZATION
// // ==========================================================
// dbConnect(); // Connect to MongoDB
// const app = express();
// const PORT = process.env.PORT || 5000;

// // CRITICAL FIX: Required for secure cookies (JWTs/Sessions) to work on Render
// // Render uses a proxy/load balancer, and Express must trust it to recognize HTTPS.
// if (process.env.NODE_ENV === 'production') {
//     app.set('trust proxy', 1); // Set to 1 as Render uses one proxy layer
// }


// // ==========================================================
// // 4. CORS CONFIGURATION (CRITICAL FIX APPLIED HERE)
// // ==========================================================

// // Normalize all required origins: Remove trailing slashes and filter out any empty values.
// // This ensures a clean comparison in the origin check.
// const normalizedOrigins = [
//     // 1. Local Development Frontends
//     'http://localhost:5173', 
//     'http://127.0.0.1:5173',
//     // 2. Deployed Frontend URL (from environment variable)
//     process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null, 
//     // 3. Deployed Backend URL (Used for Chapa callback verification)
//     process.env.BACKEND_URL ? process.env.BACKEND_URL.replace(/\/$/, "") : null
// ].filter(Boolean);

// console.log(`CORS allowed origins: ${normalizedOrigins.join(', ')}`);

// const corsOptions = {
//     origin: (origin, callback) => {
//         // Allow requests with no origin (like mobile apps, curl requests)
//         if (!origin) return callback(null, true); 

//         // Normalize the incoming origin by removing the trailing slash
//         const normalizedOrigin = origin.replace(/\/$/, "");

//         // FIX: Check if the normalized incoming origin is strictly included in the normalized list
//         if (normalizedOrigins.includes(normalizedOrigin)) {
//             callback(null, true);
//         } else {
//             console.warn(`CORS Error: Origin ${origin} not allowed`);
//             callback(new Error(`Origin ${origin} not allowed by CORS`));
//         }
//     },
//     // Ensure all necessary methods are included
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     // CRITICAL: Allows cookies (auth) to be sent cross-domain
//     credentials: true, 
//     optionsSuccessStatus: 204
// };

// app.use(cors(corsOptions));


// // ==========================================================
// // 5. MIDDLEWARE
// // ==========================================================
// app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());


// // ==========================================================
// // 6. HEALTH CHECK & ROOT ROUTE
// // ==========================================================
// app.get('/', (req, res) => {
//     res.send(`Smart Delivery API is running on port ${PORT}`);
// });


// // ==========================================================
// // 7. API ROUTES 
// // ==========================================================
// // All API routes are correctly mounted under the /api prefix
// app.use('/api/auth', authRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/restaurants', restaurantRoutes); 
// app.use('/api/notifications', notificationRoutes);


// // ==========================================================
// // 8. ERROR HANDLING MIDDLEWARE
// // ==========================================================
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     const errorMessage = err.message.includes('CORS') ? err.message : (err.message || 'Something broke on the server!');
//     
//     // Use the error status code if provided, otherwise default to 500
//     res.status(err.statusCode || 500).send({
//         success: false,
//         message: errorMessage
//     });
// });


// // ==========================================================
// // 9. START SERVER
// // ==========================================================
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
































// ==========================================================
// 1. MODULE IMPORTS
// ==========================================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables from .env file
dotenv.config();

const dbConnect = require('./config/dbConnect');

// ==========================================================
// 2. ROUTE IMPORTS 
// ==========================================================
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// ==========================================================
// 3. INITIALIZATION
// ==========================================================
dbConnect(); // Connect to MongoDB
const app = express();
const PORT = process.env.PORT || 5000;

// CRITICAL FIX: Required for secure cookies (JWTs/Sessions) to work on Render
// Render uses a proxy/load balancer, and Express must trust it to recognize HTTPS.
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Set to 1 as Render uses one proxy layer
}


// ==========================================================
// 4. CORS CONFIGURATION (CRITICAL FIX APPLIED HERE)
// ==========================================================

// Normalize all required origins: Remove trailing slashes and filter out any empty values.
// This ensures a clean comparison in the origin check.
const normalizedOrigins = [
    // 1. Local Development Frontends
    'http://localhost:5173', 
    'http://127.0.0.1:5173',
    // 2. Deployed Frontend URL (from environment variable)
    process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null, 
    // 3. Deployed Backend URL (Used for Chapa callback verification)
    process.env.BACKEND_URL ? process.env.BACKEND_URL.replace(/\/$/, "") : null
].filter(Boolean);

console.log(`CORS allowed origins: ${normalizedOrigins.join(', ')}`);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true); 

        // Normalize the incoming origin by removing the trailing slash
        const normalizedOrigin = origin.replace(/\/$/, "");

        // FIX: Check if the normalized incoming origin is strictly included in the normalized list
        if (normalizedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            console.warn(`CORS Error: Origin ${origin} not allowed`);
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    // Ensure all necessary methods are included
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // CRITICAL: Allows cookies (auth) to be sent cross-domain
    credentials: true, 
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


// ==========================================================
// 5. MIDDLEWARE
// ==========================================================
// FIX: Increased payload limit to 10MB to resolve PayloadTooLargeError
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());


// ==========================================================
// 6. HEALTH CHECK & ROOT ROUTE
// ==========================================================
app.get('/', (req, res) => {
    res.send(`Smart Delivery API is running on port ${PORT}`);
});


// ==========================================================
// 7. API ROUTES 
// ==========================================================
// All API routes are correctly mounted under the /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/restaurants', restaurantRoutes); 
app.use('/api/notifications', notificationRoutes);


// ==========================================================
// 8. ERROR HANDLING MIDDLEWARE
// ==========================================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    const errorMessage = err.message.includes('CORS') ? err.message : (err.message || 'Something broke on the server!');
    
    // Use the error status code if provided, otherwise default to 500
    res.status(err.statusCode || 500).send({
        success: false,
        message: errorMessage
    });
});


// ==========================================================
// 9. START SERVER
// ==========================================================
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});