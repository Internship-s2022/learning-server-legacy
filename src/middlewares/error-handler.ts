import { NextFunction, Request, Response } from 'express';

import logger from 'src/config/logger';
import { CustomError } from 'src/models/custom-error';

type CustomTypeError = TypeError & {
  label?: string;
};

const errorHandler = (
  err: CustomTypeError | CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // TO-DO: Fix name of the error
  let customError = new CustomError(500, 'Something went wrong.', {
    errorInfo: err.message,
    stack: 'stack' in err ? err.stack : '',
    label: 'label' in err ? err?.label : '',
  });

  if (err instanceof CustomError) {
    customError = err;
  }

  logger.log({
    level: customError.status === 404 || customError.status === 400 ? 'warn' : 'error',
    message: err.message || customError.message,
    label: customError?.data?.label,
    ...customError?.data,
  });

  delete customError?.data?.label;

  res.status((customError as CustomError).status).json({
    message: customError.message,
    data: customError.data,
    error: true,
  });
};

export default errorHandler;
