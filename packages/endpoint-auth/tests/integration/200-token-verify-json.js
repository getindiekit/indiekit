import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns verified JSON access token", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);

  const result = await request
    .get("/auth/token")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 200);
  t.truthy(result.body.client_id);
  t.is(result.body.me, "https://website.example");
  t.truthy(result.body.scope);

  server.close(t);
});
