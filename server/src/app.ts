import express from 'express';
import userRoutes from './routes/users';
import logger from './utils/logger';

const app = express();

app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Global error handler (should be after routes)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });

    const statusCode = err.statusCode || 500;
    const message =
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message;

    res.status(statusCode).json({ error: message });
  },
);

export default app;
