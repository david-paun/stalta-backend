import { ErrorMessage } from '../../models/ErrorMessage.js';

export const errorMessage = (
  status: number,
  message: string,
  stack?: string
): ErrorMessage => {
  const errorResponse: ErrorMessage = {
    status: status,
    message: message,
    stack: stack,
  };
  return errorResponse;
};
