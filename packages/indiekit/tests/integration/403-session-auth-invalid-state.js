import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 403 error auth with invalid code/state", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/session/auth")
    .query("redirect=%2Fstatus")
    .query("code=foo")
    .query("state=bar");

  t.is(result.status, 403);
  t.true(result.text.includes("Invalid value for <code>state</code>"));

  server.close(t);
});
