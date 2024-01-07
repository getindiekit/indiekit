import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";

await mockAgent("endpoint-files");
const server = await testServer({
  application: {
    mediaEndpoint: "https://media-endpoint.example",
  },
});
const request = supertest.agent(server);

describe("endpoint-files POST /files/:uid/delete", () => {
  it("Returns 401 error deleting file", async () => {
    const result = await request
      .post(`/files/401/delete`)
      .set("cookie", testCookie())
      .send({ url: "https://website.example/401.jpg" });

    assert.equal(result.status, 401);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
