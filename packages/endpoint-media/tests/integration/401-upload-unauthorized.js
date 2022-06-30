import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 401 error token doesn’t have adequate scope", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/media")
    .auth(process.env.TEST_TOKEN_NO_SCOPE, { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 401);
  t.is(
    result.body.error_description,
    "JSON Web Token error: invalid signature"
  );

  server.close(t);
});
