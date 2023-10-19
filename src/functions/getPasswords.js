import { db } from "@/services/db";
import { sendResponse, sendError } from "@/responses";
import { checkPermission } from "@/middleware/permission";
import { middyfy } from "@/services/middify";
import { decryptPassword } from "@/models/user";

const getPasswords = async (event) => {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': event.user,
      },
    };

    const { Items } = await db.query(params).promise();

    const domains = Items
      .filter(item => item.SK !== event.user)
      .map(item => ({ domain: item.SK, username: item.username, password: decryptPassword(item.password) }));

    return sendResponse(200, { success: true, domains });
  } catch (error) {
    return sendError(500, { success: false, error: error.message });
  }
}

export const handler = middyfy(getPasswords).use(checkPermission);