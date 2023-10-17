import { sendError, sendResponse } from '@/responses';
import { middyfy } from '@/services/middify';
import { validateAuth } from '@/middleware/validation';

const login = async (event) => {
  try {
    return sendResponse(200, {
      message: 'Login successfully',
    });
  } catch (error) {
    return sendError(500, error.message);
  }
};

export const handler = middyfy(login).use(validateAuth);
