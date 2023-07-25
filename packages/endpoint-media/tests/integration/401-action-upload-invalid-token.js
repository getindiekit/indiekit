import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 401 error invalid token", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/media")
    .auth("foo.bar.baz", { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 401);
  t.is(
    result.body.error_description,
    "The access token provided is expired, revoked, malformed, or invalid for other reasons",
  );

  server.close(t);
});
