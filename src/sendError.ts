import type { IncomingMessage, ServerResponse } from 'http';

export function sendError(
  response: ServerResponse<IncomingMessage>,
  statusCode: number,
  message: string,
) {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain' });
  response.end(message);
}

export function sendBadRequestError(
  response: ServerResponse<IncomingMessage>,
  message: string,
) {
  sendError(response, 400, message);
}

export function sendNotFoundError(
  response: ServerResponse<IncomingMessage>,
  message: string,
) {
  sendError(response, 404, message);
}
