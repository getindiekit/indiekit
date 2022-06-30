import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns list of previously uploaded files", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/media")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .query("q=source");

  t.truthy(result.body.items);

  server.close(t);
});
