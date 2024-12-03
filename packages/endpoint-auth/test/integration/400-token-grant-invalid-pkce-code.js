import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { after, before, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

import { signToken } from "../../lib/token.js";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);
const base64Digest = createHash("sha256").update("foobar").digest("base64url");
const codeChallenge = base64Digest.toString();

describe("endpoint-auth POST /auth/token", () => {
  before(async () => {
    await request
      .get("/auth")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ code_challenge: codeChallenge })
      .query({ code_challenge_method: "S256" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
      .query({ response_type: "code" })
      .query({ state: "12345" });
  });

  it("Returns 401 error fails PKCE code challenge", async () => {
    const code = signToken({
      access_token: "token",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      scope: "create update delete media",
      token_type: "Bearer",
    });
    const result = await request
      .post("/auth/token")
      .set("accept", "application/json")
      .query({ client_id: "https://auth-endpoint.example" })
      .query({ code })
      .query({ code_verifier: "bar" }) // Invalid value
      .query({ grant_type: "authorization_code" })
      .query({ redirect_uri: "https://auth-endpoint.example/redirect" });

    assert.equal(result.status, 401);
    assert.equal(
      result.body.error_description,
      "Invalid value provided for: `code_verifier`",
    );
  });

  after(() => server.close());
});
