import { db } from "@/services/db";
import { sendResponse } from "@/responses";

export const handler = async (event) => {
  return sendResponse(200, {
    message: "GENERATE PASSWORD",
  })
}