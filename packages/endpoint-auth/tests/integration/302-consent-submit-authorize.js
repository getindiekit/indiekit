import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { createPasswordHash } from "../../lib/password.js";

await mockAgent("endpoint-auth");

test("Returns 302 submitting authorized user", async (t) => {
  process.env.PASSWORD_SECRET = await createPasswordHash("foo");

  const server = await testServer();
  const request = supertest.agent(server);

  // Get reference for `request_uri`
  const authResponse = await request
    .get("/auth")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "code" })
    .send({ scope: "create" })
    .query({ state: "12345" });
  const reference = authResponse.headers.location.slice(-16);

  // Submit form with expanded scope
  const result = await request
    .post("/auth/consent")
    .type("form")
    .query({ request_uri: `urn:ietf:params:oauth:request_uri:${reference}` })
    .send({ scope: ["create", "update"] })
    .send({ password: "foo" });

  t.is(result.status, 302);
  t.regex(result.headers.location, /code=(.*)&iss=(.*)&state=(.*)/);

  server.close(t);
});
