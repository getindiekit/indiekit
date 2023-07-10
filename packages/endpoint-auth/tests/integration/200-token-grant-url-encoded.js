import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { signToken } from "../../lib/token.js";

await mockAgent("endpoint-auth");

test("Returns URL encoded access token", async (t) => {
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
  const response = await request
    .post("/auth/token")
    .set("accept", "application/x-www-form-urlencoded")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ code })
    .query({ grant_type: "authorization_code" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" });
  const responseTextRegexp =
    /access_token=(?<access_token>.*)&token_type=(?<token_type>.*)&me=(?<me>.*)&scope=(?<scope>.*)/;
  const result = response.text.match(responseTextRegexp).groups;

  t.is(response.status, 200);
  t.truthy(result.access_token);
  t.is(result.me, encodeURIComponent("https://website.example"));
  t.truthy(result.scope);
  t.is(result.token_type, "Bearer");

  server.close(t);
});
