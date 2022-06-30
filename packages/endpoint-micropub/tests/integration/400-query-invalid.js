import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error query parameter not provided", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .query("foo=bar");

  t.is(result.status, 400);
  t.is(result.body.error_description, "Missing parameter: `q`");

  server.close(t);
});
