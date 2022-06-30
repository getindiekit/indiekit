import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error no file included in request", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/media")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 400);
  t.is(result.body.error_description, "No file included in request");

  server.close(t);
});
