import { db } from "@/services/db";
import { sendResponse, sendError } from "@/responses";
import { checkPermission } from "@/middleware/permission";
import { middyfy } from "@/services/middify";

const getDomains = async (event) => {
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': event.user,
      },
    };

    const { Items } = await db.query(params).promise();

    const domains = Items.filter(item => item.SK !== event.user).map(({ SK }) => SK);

    return sendResponse(200, { success: true, domains });
  } catch (error) {
    console.error(error)
    return sendError(500, { success: false, error: 'Could not fetch domains' });
  }
}

export const handler = middyfy(getDomains).use(checkPermission);