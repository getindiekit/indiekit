import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Status redirects unauthorised user to login page", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request.get("/status");

  t.is(result.header.location, "/session/login?redirect=/status");
  t.is(result.status, 302);

  server.close(t);
});
