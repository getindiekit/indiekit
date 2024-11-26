import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /session/auth", () => {
  it("Returns 403 error auth with invalid redirect", async () => {
    const result = await request
      .get("/session/auth")
      .query({ redirect: "https://external.example" });

    assert.equal(result.status, 403);
    assert.equal(result.text.includes("Invalid redirect attempted"), true);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
