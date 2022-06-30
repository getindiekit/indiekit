import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 400 error malformed token provided", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/token")
    .auth("foobar", { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 401);
  t.is(result.body.error_description, "JSON Web Token error: jwt malformed");

  server.close(t);
});
