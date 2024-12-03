import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth/consent", () => {
  let reference;

  before(async () => {
    process.env.PASSWORD_SECRET = "";
    const response = await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
      .query({ response_type: "code" })
      .query({ state: "12345" });
    reference = response.headers.location.split(":").at(-1);
  });

  it("Returns 302 setup password secret", async () => {
    const result = await request
      .get("/auth/consent")
      .query({ request_uri: `urn:ietf:params:oauth:request_uri:${reference}` });

    assert.equal(result.status, 302);
    assert.equal(result.headers.location, "/auth/new-password?setup=true");
  });

  after(() => server.close());
});
