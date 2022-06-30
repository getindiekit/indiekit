import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Homepage redirects to status page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/");

  t.is(result.header.location, "/status");
  t.is(result.status, 302);

  server.close(t);
});
