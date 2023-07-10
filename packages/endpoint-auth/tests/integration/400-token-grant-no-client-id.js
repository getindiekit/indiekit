import test from "ava";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";

await mockAgent("endpoint-auth");

test("Returns 400 error no `client_id`", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/auth/token")
    .set("accept", "application/json")
    .query({ code: "code" })
    .query({ grant_type: "authorization_code" })
    .query({ redirect_uri: "/" });

  t.is(result.status, 400);
  t.is(result.body.error_description, "Missing parameter: `client_id`");

  server.close(t);
});
