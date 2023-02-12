import request from "supertest";
import { server } from "./";

describe("index", () => {
  it('should respond with "Hello World"', async () => {
    const res = await request(server).get("/");
    expect(res.text).toBe("Hello World");
  });
});
