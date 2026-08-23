import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth", () => {
<<<<<<<< HEAD:packages/endpoint-auth/test/integration/200-authorization-no-response-type.js
  it("Returns documentation with no `response_type` error", async () => {
    const result = await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
========
  it("Accepts a request from indieauth.com with no `response_type`", async () => {
    // indieauth.com omits `response_type` for authentication-only requests,
    // sending an empty `scope` alongside it. Every other client is still
    // required to send it, covered by 200-authorization-no-response-type.
    const result = await request
      .get("/auth")
      .query({ client_id: "https://indieauth.com/" })
      .query({ redirect_uri: "https://indieauth.com/auth/redirect" })
      .query({ scope: "" })
>>>>>>>> 10382378c (fix(endpoint-auth): limit missing `response_type` to indieauth.com):packages/endpoint-auth/test/integration/302-authorization-no-response-type.js
      .query({ state: "12345" });

    assert.equal(result.status, 200);
    assert.equal(
      result.text.includes("Missing parameter: <code>response_type</code>"),
      true,
    );
  });

  after(() => server.close());
});
