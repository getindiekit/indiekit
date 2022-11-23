import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns JF2 Feed", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/feed.jf2");

  t.is(result.status, 200);
  t.is(result.type, "application/jf2feed+json");
  t.is(result.body.name, "Test configuration");
  t.deepEqual(result.body.children, []);

  server.close(t);
});
