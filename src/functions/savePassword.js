import { db } from "@/services/db";
import { sendResponse, sendError } from "@/responses";
import { middyfy } from "@/services/middify";
import { checkPermission } from "@/middleware/permission";
import { encryptPassword } from "@/models/user";

export const savePassword = async (event) => {
  const { domain, username, password } = event.body;

  if (!domain || !username || !password) {
    return sendResponse(400, { error: 'Missing domain, username or password' })
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: event.user,
      SK: domain,
      username,
      password: encryptPassword(password),
    },
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
  };

  try {
    await db.put(params).promise();
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      return sendError(409, { success: false, error: 'Password already exists for this domain' });
    }
    return sendError(500, { success: false, error: 'Could not save password' });
  }

  return sendResponse(200, { success: true })
}

export const handler = middyfy(savePassword).use(checkPermission);