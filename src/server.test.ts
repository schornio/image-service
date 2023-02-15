import { createServer as createTestServer } from 'http-server';
import { readFile } from 'fs/promises';
import request from 'supertest';
import { server } from './server';

const FIXTURES_PATH = `${__dirname}/test/fixtures`;

const testServer = createTestServer({ root: FIXTURES_PATH });

describe('server', () => {
  beforeAll((callback) => {
    jest.useFakeTimers();
    testServer.listen(8080, callback);
  });

  afterAll(() => {
    jest.useRealTimers();
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

  it('should return 400 for invalid domain', async () => {
    const repsonse = await request(server)
      .get('/10x10/localhost:8081/10x10/invalid.jpg')
      .expect(400);
    expect(repsonse.text).toEqual('Invalid domain');
  });

  it('should return 400 for invalid content-type', async () => {
    const repsonse = await request(server)
      .get('/10x10/localhost:8080/invalid-content-type.txt')
      .expect(400);
    expect(repsonse.text).toEqual('Unsupported content type');
  });

  it('should return 400 for invalid URL', async () => {
    const repsonse = await request(server).get('/invalid').expect(400);
    expect(repsonse.text).toEqual('Invalid URL');
  });

  it('should return 400 if no url is provided', async () => {
    const repsonse = await request(server).get('').expect(400);
    expect(repsonse.text).toEqual('Invalid URL');
  });

  it('should return 404 for non-existing image', async () => {
    const repsonse = await request(server)
      .get('/10x10/localhost:8080/10x10/invalid.jpg')
      .expect(404);
    expect(repsonse.text).toEqual('Image not found');
  });

  it('should return 200 for liveness probe', async () => {
    const mockTimeString = '2021-01-01T00:00:00.000Z';
    jest.setSystemTime(new Date(mockTimeString));

    const repsonse = await request(server).get('/health').expect(200);
    expect(repsonse.text).toEqual(`OK - ${mockTimeString}`);
  });
});
