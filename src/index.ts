import { createServer } from 'http';

export const server = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

// server.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
