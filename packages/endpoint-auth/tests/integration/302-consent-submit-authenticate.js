import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { createPasswordHash } from "../../lib/password.js";

await mockAgent("auth-endpoint");

test("Returns 302 submitting authenticated user", async (t) => {
  process.env.PASSWORD_SECRET = createPasswordHash("foo");
  const server = await testServer();
  const request = supertest.agent(server);
  const authRequest = await request
    .get("/auth")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "code" })
    .query({ state: "12345" });
  const reference = authRequest.headers.location.slice(-16);

  const result = await request
    .post("/auth/consent")
    .type("form")
    .query({ request_uri: `urn:ietf:params:oauth:request_uri:${reference}` })
    .send({ password: "foo" });

  t.is(result.status, 302);
  t.regex(result.headers.location, /code=(.*)&iss=(.*)&state=(.*)/);

  server.close(t);
});
