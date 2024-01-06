import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media POST /media", () => {
  it("Returns 401 error invalid token", async () => {
    const result = await request
      .post("/media")
      .auth("foo.bar.baz", { type: "bearer" })
      .set("accept", "application/json");

    assert.equal(result.status, 401);
    assert.equal(
      result.body.error_description,
      "The access token provided is expired, revoked, malformed, or invalid for other reasons",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
