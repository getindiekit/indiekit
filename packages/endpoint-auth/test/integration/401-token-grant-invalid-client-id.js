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
  before(async () => {
    await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
      .query({ response_type: "code" })
      .query({ state: "12345" });
  });

  it("Returns 401 error invalid `client_id`", async () => {
    const code = signToken({
      access_token: "token",
      me: "https://website.example",
      scope: "create update delete media",
      token_type: "Bearer",
    });
    const result = await request
      .post("/auth/token")
      .set("accept", "application/json")
      .query({ client_id: "https://another.example" })
      .query({ code })
      .query({ grant_type: "authorization_code" })
      .query({ redirect_uri: "https://website.example/redirect" });

    assert.equal(result.status, 401);
    assert.equal(
      result.body.error_description,
      "Invalid value provided for: `client_id`",
    );
  });

  after(() => server.close());
});
