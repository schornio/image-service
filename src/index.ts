import { server } from './server';

const PORT = process.env.PORT ?? '80';

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
});
