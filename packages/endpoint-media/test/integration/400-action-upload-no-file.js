import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media POST /media", () => {
  it("Returns 400 error no file included in request", async () => {
    const result = await request
      .post("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json");

    assert.equal(result.status, 400);
    assert.equal(result.body.error_description, "No file included in request");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
