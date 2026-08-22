import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth", () => {
  it("Accepts a request with no `response_type`", async () => {
    // Clients predating the current specification omit `response_type` for
    // authentication-only requests, sending an empty `scope` alongside it.
    // indieauth.com still signs users in this way.
    const result = await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
      .query({ scope: "" })
      .query({ state: "12345" });

    assert.equal(result.status, 302);
    assert.match(result.headers.location, /request_uri=/);
  });

  after(() => server.close());
});
