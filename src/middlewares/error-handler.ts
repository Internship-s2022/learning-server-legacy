import { NextFunction, Request, Response } from 'express';

import { CustomError } from 'src/models/custom-error';

const errorHandler = (
  err: TypeError | CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let customError = new CustomError(500, 'Something went wrong', { errorInfo: err.message });

  if (err instanceof CustomError) {
    customError = err;
  }

  res.status((customError as CustomError).status).json({
    message: customError.message,
    data: customError.data,
    error: true,
  });
};

export default errorHandler;
