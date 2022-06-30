import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Verifies token and returns JSON", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/token")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 200);
  t.truthy(result.body.client_id);
  t.is(result.body.me, process.env.TEST_PUBLICATION_URL);
  t.truthy(result.body.scope);

  server.close(t);
});
