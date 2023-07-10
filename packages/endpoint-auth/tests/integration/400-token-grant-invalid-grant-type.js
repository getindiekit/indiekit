import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("endpoint-auth");

test("Returns 400 error invalid `grant_type`", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/auth/token")
    .set("accept", "application/json")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ code: "code" })
    .query({ grant_type: "response_code" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" });

  t.is(result.status, 400);
  t.is(
    result.body.error_description,
    "Invalid value provided for: `grant_type`"
  );

  server.close(t);
});
