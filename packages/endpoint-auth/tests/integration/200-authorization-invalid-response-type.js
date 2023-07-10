import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("endpoint-auth");

test("Returns documentation with invalid `response_type` error", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/auth")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "foo" })
    .query({ state: "12345" });

  t.is(result.status, 200);
  t.true(
    result.text.includes(
      "Invalid value provided for: <code>response_type</code>"
    )
  );

  server.close(t);
});
