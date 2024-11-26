import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { getFixture } from "@indiekit-test/fixtures";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-media");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media POST /media", () => {
  it("Uploads file", async () => {
    const result = await request
      .post("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

    assert.equal(result.status, 201);
    assert.match(result.headers.location, /\b.jpg\b/);
    assert.match(result.body.success_description, /\bMedia uploaded\b/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
