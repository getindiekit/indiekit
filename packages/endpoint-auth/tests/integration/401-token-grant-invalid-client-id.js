import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { signToken } from "../../lib/token.js";

await mockAgent("auth-endpoint");

test("Returns 401 error invalid `client_id`", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  await request
    .get("/auth")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "code" })
    .query({ state: "12345" });
  const code = signToken({
    access_token: "token",
    me: process.env.TEST_PUBLICATION_URL,
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

  t.is(result.status, 401);
  t.is(
    result.body.error_description,
    "Invalid value provided for: `client_id`"
  );

  server.close(t);
});
