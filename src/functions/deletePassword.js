import { db } from "@/services/db";
import { sendResponse, sendError } from "@/responses";
import { checkPermission } from "@/middleware/permission";
import { middyfy } from "@/services/middify";

const deletePassword = async (event) => {
  const { domain } = event.pathParameters;

  if (!domain) {
    return sendResponse(400, { error: 'Missing domain' })
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: event.user,
      SK: domain,
    }
  };

  try {
    const { Item } = await db.get(params).promise();

    if (!Item) {
      return sendError(404, { success: false, error: 'Password not found' });
    }

    await db.delete(params).promise();
    return sendResponse(200, { success: true });

  } catch (error) {
    return sendError(500, { success: false, error: 'Could not delete password' });
  }
}

export const handler = middyfy(deletePassword).use(checkPermission);