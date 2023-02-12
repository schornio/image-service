import { IncomingMessage, ServerResponse, createServer } from 'http';
import { sendBadRequestError, sendNotFoundError } from './sendError';
import sharp from 'sharp';

const REGEX = /^\/(\d*)x(\d*)\/(.*)/u;

const CONTENT_TYPES = (process.env.CONTENT_TYPES ?? 'image/jpeg,image/png')
  .split(',')
  .map((type) => type.trim());

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse<IncomingMessage>,
) {
  // url is always defined, but the type definition is wrong
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const url = request.url!;

  const [_match, widthConfig, heightConfig, imageURL] = url.match(REGEX) ?? [];

  if (_match && imageURL && imageURL.length > 0) {
    const width = widthConfig ? parseInt(widthConfig, 10) : undefined;
    const height = heightConfig ? parseInt(heightConfig, 10) : undefined;

    // ToDo: check if the domain is allowed

    const imageResponse = await fetch(`http://${imageURL}`);
    if (imageResponse.ok) {
      const imageArrayBuffer = await imageResponse.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);

      const imageContentType =
        imageResponse.headers.get('content-type') ?? 'unknown';

      if (CONTENT_TYPES.includes(imageContentType)) {
        response.setHeader('Content-Type', imageContentType);
        response.setHeader('Cache-Control', 'public, max-age=31536000');

        sharp(imageBuffer).resize(width, height).pipe(response);
      } else {
        sendBadRequestError(response, 'Unsupported content type');
      }
    } else {
      sendNotFoundError(response, 'Image not found');
    }
  } else {
    sendBadRequestError(response, 'Invalid URL');
  }
}

export const server = createServer(handleRequest);
