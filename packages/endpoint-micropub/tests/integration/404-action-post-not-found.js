import process from "node:process";
import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 404 error action not supported (by scope)", async (t) => {
  // Create post
  const server = await testServer();
  const request = supertest.agent(server);
  const result = await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .send({
      action: "delete",
      url: "https://website.example/foo",
    });

  t.is(result.status, 404);
  t.is(
    result.body.error_description,
    "No database record found for https://website.example/foo"
  );

  server.close(t);
});
