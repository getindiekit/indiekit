import { strict as assert } from "node:assert";
import { before, after, describe, it } from "node:test";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-media");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media POST /media", () => {
  let response;

  before(async () => {
    response = await request
      .post("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");
  });

  it("Deletes file", async () => {
    const result = await request
      .post("/media")
      .auth(testToken(), { type: "bearer" })
      .send({
        action: "delete",
        url: response.header.location,
      });

    assert.equal(result.status, 200);
    assert.match(result.body.success_description, /\bFile deleted\b/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
