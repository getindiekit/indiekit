import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/introspect", () => {
  it("Returns inactive access token", async () => {
    const result = await request
      .post("/auth/introspect")
      .auth(testToken({ invalid: true }), { type: "bearer" })
      .set("accept", "application/json");

    assert.equal(result.status, 200);
    assert.equal(result.body.active, false);
  });

  after(() => server.close());
});
