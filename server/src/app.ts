import express from 'express';
import router from './routes';
import logger from './utils/logger';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AppError } from './errors';
import crypto from 'crypto';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Add request ID for tracking
app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  next();
});

// Allow only the Vite dev origin:
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);
app.use(router);

// Global error handler (should be after routes)
// Express 5 automatically catches async errors - no wrapper needed!
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    // Log the error for debugging
    logger.error('Error:', {
      requestId: req.id,
      message: err.message,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    });

    // Handle AppError instances (our custom errors with status codes)
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        error: err.message,
        statusCode: err.statusCode,
        code: err.code,
        requestId: req.id,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
      });
    }

    // Handle validation errors from Zod
    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation error',
        statusCode: 400,
        details: err.errors,
        requestId: req.id,
      });
    }

    // Handle JWT errors that weren't caught earlier
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Authentication failed',
        statusCode: 401,
        message: err.message,
        requestId: req.id,
      });
    }

    // Default to 500 server error for unknown errors
    const statusCode = err.statusCode || 500;
    const message =
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message || 'An unexpected error occurred';

    res.status(statusCode).json({
      error: message,
      statusCode,
      requestId: req.id,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  },
);

export default app;
