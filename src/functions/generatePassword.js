import { sendResponse } from "@/responses";
import generator from "generate-password";

export const handler = async (event) => {
  const password = generator.generate({
    length: 16,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
    strict: true
  });

  return sendResponse(200, { password })
}