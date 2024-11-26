import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /session/auth", () => {
  it("Returns 400 error auth with missing state", async () => {
    const result = await request
      .get("/session/auth")
      .query({ redirect: "/status" });

    assert.equal(result.status, 400);
    assert.equal(
      result.text.includes("Missing parameter: <code>code</code>"),
      true,
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
