import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth", () => {
  it("Accepts a request from indieauth.com with no `response_type`", async () => {
    // indieauth.com omits `response_type` for authentication-only requests,
    // sending an empty `scope` alongside it. Every other client is still
    // required to send it, covered by 200-authorization-no-response-type.
    const result = await request
      .get("/auth")
      .query({ client_id: "https://indieauth.com/" })
      .query({ redirect_uri: "https://indieauth.com/auth/redirect" })
      .query({ scope: "" })
      .query({ state: "12345" });

    assert.equal(result.status, 302);
    assert.match(result.headers.location, /request_uri=/);
  });

  after(() => server.close());
});
