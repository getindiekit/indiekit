import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns media endpoint", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .get("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .query("q=media-endpoint");

  t.truthy(response.body["media-endpoint"]);

  server.close(t);
});
