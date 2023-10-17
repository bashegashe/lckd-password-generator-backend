import { db } from '@/services/db';
import { sendError, sendResponse } from '@/responses';
import { validateAuth } from '@/middleware/validation';
import CryptoJS from 'crypto-js';
import { middyfy } from '@/services/middify';
import { encryptPassword } from '@/models/user';

const register = async (event) => {
  try {
    const { username, password } = event.body;

    const encryptedPassword = encryptPassword(password);
    await db
      .put({
        TableName: process.env.TABLE_NAME,
        Item: {
          PK: username,
          SK: username,
          password: encryptedPassword,
        },
        ConditionExpression: 'attribute_not_exists(PK)',
      })
      .promise();
    return sendResponse(200, {
      message: 'register successfully',
      encryptedPassword,
    });
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      return sendError(400, 'Username already exists');
    }
    return sendError(500, error.message);
  }
};

export const handler = middyfy(register).use(validateAuth);
