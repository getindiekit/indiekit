import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns categories", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .query("q=category");

  t.truthy(response.body.categories);

  server.close(t);
});
