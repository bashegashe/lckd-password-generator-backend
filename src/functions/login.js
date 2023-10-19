import { sendError, sendResponse } from '@/responses';
import { middyfy } from '@/services/middify';
import { validateAuth } from '@/middleware/validation';
import { checkPassword, generateToken, getUser } from '@/models/user';

const login = async (event) => {
  try {
    const { username, password } = event.body;
    const user = await getUser(username);
    if (!user) {
      return sendError(400, 'Username not exists');
    }
    if (!checkPassword(password, user.password)) {
      return sendError(400, 'Password is incorrect');
    }
    const token = generateToken(username);
    return sendResponse(200, {
      message: 'Login successfully',
      token,
    });
  } catch (error) {
    return sendError(500, error.message);
  }
};

export const handler = middyfy(login).use(validateAuth);
