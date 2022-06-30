import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns config", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .query("q=config");

  t.truthy(response.body["media-endpoint"]);
  t.truthy(response.body["post-types"]);
  t.truthy(response.body["syndicate-to"]);
  t.truthy(response.body.q);

  server.close(t);
});
