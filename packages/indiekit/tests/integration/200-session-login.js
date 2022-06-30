import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns login page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/session/login");

  t.is(result.headers["x-robots-tag"], "noindex");
  t.is(result.status, 200);
  t.is(result.type, "text/html");

  server.close(t);
});
