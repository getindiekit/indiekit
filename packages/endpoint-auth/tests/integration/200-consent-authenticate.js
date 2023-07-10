import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { createPasswordHash } from "../../lib/password.js";

await mockAgent("endpoint-auth");

test("Returns authentication consent form", async (t) => {
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
    .get("/auth/consent")
    .query({ request_uri: `urn:ietf:params:oauth:request_uri:${reference}` });

  t.is(result.status, 200);
  t.true(result.text.includes("Sign in"));

  server.close(t);
});
