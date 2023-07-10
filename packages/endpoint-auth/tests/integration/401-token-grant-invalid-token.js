import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("endpoint-auth");

test("Returns 401 error unable to grant token", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  await request
    .get("/auth")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "code" })
    .query({ state: "12345" });
  const result = await request
    .post("/auth/token")
    .set("accept", "application/json")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ code: "foobar" })
    .query({ grant_type: "authorization_code" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" });

  t.is(result.status, 401);
  t.is(
    result.body.error_description,
    "The access token provided is expired, revoked, malformed, or invalid for other reasons"
  );

  server.close(t);
});
