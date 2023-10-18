import { getUser, verifyToken } from '@/models/user';
import { sendError } from '@/responses';

const checkPermission = {
  before: async (req) => {
    try {
      const token = req.event.headers['authorization'].split(' ')[1];
      if (!token) {
        return sendError(400, 'Token is required');
      }

      const decode = verifyToken(token);
      const user = await getUser(decode.username);
      if (!user) {
        return sendError(400, 'Token is invalid');
      }

      req.event.user = user.PK;
      return req.response;
    } catch (error) {
      return sendError(401, error.message);
    }
  },
};

export { checkPermission };
