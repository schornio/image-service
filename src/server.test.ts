import { createServer as createTestServer } from 'http-server';
import { readFile } from 'fs/promises';
import request from 'supertest';
import { server } from './server';

const FIXTURES_PATH = `${__dirname}/test/fixtures`;

const testServer = createTestServer({ root: FIXTURES_PATH });

describe('server', () => {
  beforeAll(() => {
    testServer.listen(8080);
  });

  afterAll(() => {
    testServer.close();
  });

  it.each(['10x40', '20x', 'x30'])(
    'should resize an image to %s',
    async (testPath) => {
      const inputImagePath = 'input.jpg';
      const outputImagePath = 'output.jpg';

      const outputImage = await readFile(
        `${FIXTURES_PATH}/${testPath}/${outputImagePath}`,
      );

      const response = await request(server)
        .get(`/${testPath}/localhost:8080/${testPath}/${inputImagePath}`)
        .expect(200);

      expect(response.body).toEqual(outputImage);
    },
  );

  it('should return 400 for invalid content-type', async () => {
    await request(server)
      .get('/10x10/localhost:8080/invalid-content-type.txt')
      .expect(400);
  });

  it('should return 400 for invalid URL', async () => {
    await request(server).get('/invalid').expect(400);
  });

  it('should return 400 if no url is provided', async () => {
    await request(server).get('').expect(400);
  });

  it('should return 404 for non-existing image', async () => {
    await request(server)
      .get('/10x10/localhost:8080/10x10/invalid.jpg')
      .expect(404);
  });
});
