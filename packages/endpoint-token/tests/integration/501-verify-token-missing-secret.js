import process from "node:process";
import test from "ava";
import sinon from "sinon";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 501 error verifying token if missing secret", async (t) => {
  sinon.stub(process.env, "SECRET").value("");
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .get("/token")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 501);
  t.is(result.body.error, "not_implemented");
  t.is(result.body.error_description, "Missing `SECRET`");

  server.close(t);
});
