import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 501 error unsupported parameter provided", async (t) => {
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .query("q=fooBar");

  t.is(result.status, 501);
  t.is(result.body.error_description, "Unsupported query for `q`: `fooBar`");

  server.close(t);
});
