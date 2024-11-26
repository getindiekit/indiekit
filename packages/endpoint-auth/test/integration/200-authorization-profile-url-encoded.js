import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

import { signToken } from "../../lib/token.js";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth POST /auth", () => {
  before(async () => {
    await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
      .query({ response_type: "code" })
      .query({ state: "12345" });
  });

  it("Returns URL encoded profile", async () => {
    const code = signToken({
      access_token: "token",
      me: "https://website.example",
      scope: "create update delete media",
      token_type: "Bearer",
    });
    const response = await request
      .post("/auth")
      .set("accept", "application/x-www-form-urlencoded")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ code })
      .query({ grant_type: "authorization_code" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" });
    const responseTextRegexp = /me=(?<me>.*)/;
    const result = response.text.match(responseTextRegexp).groups;

    assert.equal(response.status, 200);
    assert.equal(result.me, encodeURIComponent("https://website.example"));
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
