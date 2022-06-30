import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Logout redirects to homepage", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/session/logout");

  t.is(result.header.location, "/");
  t.is(result.status, 302);

  server.close(t);
});
