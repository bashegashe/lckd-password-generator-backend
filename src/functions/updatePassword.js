import { db } from "@/services/db";
import { sendResponse, sendError } from "@/responses";
import { middyfy } from "@/services/middify";
import { checkPermission } from "@/middleware/permission";
import { encryptPassword } from "@/models/user";

export const updatePassword = async (event) => {
  const { domain, newPassword } = event.body;

  if (!domain || !newPassword) {
    return sendResponse(400, { error: 'Missing domain or new password' })
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: event.user,
      SK: domain,
      password: encryptPassword(newPassword),
    },
    ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)'
  };

  try {
    await db.put(params).promise();
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      return sendError(409, { success: false, error: `No password found at domain: ${domain}` });
    }
    return sendError(500, { success: false, error: 'Could not save password' });
  }

  return sendResponse(200, { success: true })
}

export const handler = middyfy(updatePassword).use(checkPermission);