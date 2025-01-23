const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import middleware
const errorMiddleware = require('./middlewares/error.middleware');

// Import routes
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');

// Import config
const config = require('./config/config');

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());  //  HTTP headers for security
app.use(cors());

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windows
});
app.use(limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Error handling middleware
app.use(errorMiddleware);


if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${process.env.NODE_ENV} mode`);
  });

  // Unhandled rejection handler
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => {
      process.exit(1);
    });
  });
}

// module.exports = app;