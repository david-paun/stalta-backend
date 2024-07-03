import { SuccessMessage } from '../../models/SuccessMessage.js';

export const successMessage = (
  status: number,
  message: string,
  data?: any,
  cookies?: any
): SuccessMessage => {
  const successResponse: SuccessMessage = {
    status: status,
    message: message,
    data: data,
    cookies: cookies,
  };
  return successResponse;
};
