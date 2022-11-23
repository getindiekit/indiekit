import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns JSON Feed", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/feed.json");

  t.is(result.status, 200);
  t.is(result.type, "application/feed+json");
  t.is(result.body.title, "Test configuration");
  t.deepEqual(result.body.items, []);

  server.close(t);
});
