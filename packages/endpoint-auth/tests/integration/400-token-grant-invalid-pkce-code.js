import crypto from "node:crypto";
import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { signToken } from "../../lib/token.js";

await mockAgent("endpoint-auth");

test("Returns 401 error fails PKCE code challenge", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const base64Digest = crypto
    .createHash("sha256")
    .update("foobar")
    .digest("base64url");
  const codeChallenge = base64Digest.toString("base64url");
  await request
    .get("/auth")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ code_challenge: codeChallenge })
    .query({ code_challenge_method: "S256" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "code" })
    .query({ state: "12345" });
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

  t.is(result.status, 401);
  t.is(
    result.body.error_description,
    "Invalid value provided for: `code_verifier`"
  );

  server.close(t);
});
