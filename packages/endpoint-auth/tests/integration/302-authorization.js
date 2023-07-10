import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("endpoint-auth");

test("Returns 302 authorization request", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/auth")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "code" })
    .query({ state: "12345" });

  t.is(result.status, 302);
  t.regex(
    result.headers.location,
    /request_uri=urn:ietf:params:oauth:request_uri:[\w-]{16}$/
  );

  server.close(t);
});
