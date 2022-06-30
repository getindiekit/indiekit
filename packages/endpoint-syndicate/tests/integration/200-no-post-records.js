import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns no post records", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/syndicate")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 200);
  t.is(result.body.success_description, "No post records available");

  server.close(t);
});
