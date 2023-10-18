import { db } from "@/services/db";
import { sendResponse, sendError } from "@/responses";
import { checkPermission } from "@/middleware/permission";
import { middyfy } from "@/services/middify";
import { decryptPassword } from "@/models/user";

const getPassword = async (event) => {
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

  const { Item } = await db.get(params).promise();

  if (!Item) {
    return sendError(404, { error: `No password found at domain: ${domain}` })
  }

  return sendResponse(200, { success: true, password: decryptPassword(Item.password), domain })
}

export const handler = middyfy(getPassword).use(checkPermission);