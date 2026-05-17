import { CustomError } from '../utils/errors.js';

export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      params: err.params
    });
  }

  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred.'
  });
};
