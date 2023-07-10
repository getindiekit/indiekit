import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { signToken } from "../../lib/token.js";

await mockAgent("endpoint-auth");

test("Returns 400 error invalid `redirect_uri`", async (t) => {
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
    me: "https://website.example",
    scope: "create update delete media",
    token_type: "Bearer",
  });
  const result = await request
    .post("/auth/token")
    .set("accept", "application/json")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ code })
    .query({ grant_type: "authorization_code" })
    .query({ redirect_uri: "https://another.example/redirect" });

  t.is(result.status, 400);
  t.is(
    result.body.error_description,
    "Invalid value provided for: `redirect_uri`"
  );

  server.close(t);
});
