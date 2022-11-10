import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns server metadata", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/auth/metadata")
    .set("accept", "application/json");

  const result = response.body;

  t.truthy(result.authorization_endpoint);
  t.is(result.code_challenge_methods_supported[0], "S256");
  t.truthy(result.issuer);
  t.is(result.response_types_supported[0], "code");
  t.truthy(result.scopes_supported);
  t.truthy(result.service_documentation);
  t.truthy(result.token_endpoint);
  t.is(result.ui_locales_supported, "en");

  server.close(t);
});
