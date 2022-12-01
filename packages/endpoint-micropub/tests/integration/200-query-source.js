import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns list of previously published posts", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .query("q=source");

  t.truthy(result.body.items);

  server.close(t);
});
