import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth/userinfo", () => {
  it("Returns 401 error if token invalid", async () => {
    const result = await request
      .get("/auth/userinfo")
      .auth("invalid", { type: "bearer" })
      .set("accept", "application/json");

    assert.equal(result.status, 401);
    assert.equal(result.body.error, "unauthorized");
    assert.match(result.body.error_description, /access token/);
  });

  after(() => server.close());
});
