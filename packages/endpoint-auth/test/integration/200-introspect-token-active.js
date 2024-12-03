import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/introspect", () => {
  it("Returns active access token", async () => {
    const result = await request
      .post("/auth/introspect")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json");

    assert.equal(result.status, 200);
    assert.equal(result.body.active, true);
    assert.ok(result.body.client_id);
    assert.equal(result.body.me, "https://website.example");
    assert.ok(result.body.scope);
  });

  after(() => server.close());
});
