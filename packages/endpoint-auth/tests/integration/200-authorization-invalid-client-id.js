import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("endpoint-auth");

test("Returns documentation with invalid `client_id` error", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/auth")
    .query({ client_id: "auth-endpoint.example" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "code" })
    .query({ state: "12345" });

  t.is(result.status, 200);
  t.true(
    result.text.includes("Invalid value provided for: <code>client_id</code>")
  );

  server.close(t);
});
