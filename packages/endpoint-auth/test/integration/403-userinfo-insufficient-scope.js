import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth/userinfo", () => {
  it("Returns 403 error if token has no profile scope", async () => {
    const result = await request
      .get("/auth/userinfo")
      .auth(testToken({ scope: "create" }), { type: "bearer" })
      .set("accept", "application/json");

    assert.equal(result.status, 403);
    assert.equal(result.body.error, "insufficient_scope");
  });

  after(() => server.close());
});
