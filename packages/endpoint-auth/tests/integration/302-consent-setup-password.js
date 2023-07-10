import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("endpoint-auth");

test("Returns 302 setup password secret", async (t) => {
  process.env.PASSWORD_SECRET = "";
  const server = await testServer();
  const request = supertest.agent(server);
  const authResponse = await request
    .get("/auth")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "code" })
    .query({ state: "12345" });
  const reference = authResponse.headers.location.slice(-16);
  const result = await request
    .get("/auth/consent")
    .query({ request_uri: `urn:ietf:params:oauth:request_uri:${reference}` });

  t.is(result.status, 302);
  t.is(result.headers.location, "/auth/new-password?setup=true");

  server.close(t);
});
