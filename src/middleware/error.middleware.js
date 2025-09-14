import logger from '#config/logger.js';
import { ZodError } from 'zod';

export const errorHandler = (error, req, res, next) => {
  logger.error('Error:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: validationErrors,
    });
  }

  // Handle known application errors
  if (error.message === 'User not found') {
    return res.status(404).json({
      error: 'Not Found',
      message: error.message,
    });
  }

  if (error.message === 'User already exists') {
    return res.status(409).json({
      error: 'Conflict',
      message: error.message,
    });
  }

  // Default server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
};