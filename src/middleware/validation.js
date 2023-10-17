import { sendError } from '@/responses';

const validateAuth = {
  before: (req) => {
    const { username, password } = req.event.body;
    if (!username || !password) {
      return sendError(400, 'username and password are required');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return sendError(400, 'username and password must be string');
    }
    console.log('validateAuth', username, password);
    return req.response;
  },
};

export { validateAuth };
