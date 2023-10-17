export function sendResponse(statusCode, response) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  };
}
export function sendError(statusCode, message) {
  return {
    statusCode: statusCode || 500,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message || 'Internal Server Error',
    }),
  };
}
