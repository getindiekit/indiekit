import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

import { signToken } from "../../lib/token.js";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth/token", () => {
  // Begin an authorization request as this client, so that whatever
  // application-wide state the server keeps refers to it.
  before(async () => {
    await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
      .query({ response_type: "code" })
      .query({ state: "12345" });
  });

  // The authorization code records the client it was issued to. Redeeming it
  // as a different client must fail, whatever authorization request happened
  // most recently on the server.
  it("Rejects a code issued to a different client", async () => {
    const code = signToken({
      client_id: "https://other-client.example",
      me: "https://website.example",
      redirect_uri: "https://other-client.example/redirect",
      scope: "create",
    });
    const result = await request
      .post("/auth/token")
      .set("accept", "application/json")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ code })
      .query({ grant_type: "authorization_code" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" });

    assert.notEqual(result.status, 200);
    assert.equal(result.body.access_token, undefined);
  });

  after(() => server.close());
});
