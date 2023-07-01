import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns inactive access token", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);

  const result = await request
    .post("/auth/introspect")
    .auth(testToken({ invalid: true }), { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 200);
  t.false(result.body.active);

  server.close(t);
});
