import process from "node:process";
import test from "ava";
import nock from "nock";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 400 updating post without operation to perform", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar"))
    .twice()
    .reply(200);

  // Create post
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send({
      type: ["h-entry"],
      properties: {
        name: ["Foobar"],
      },
    });

  // Update post
  const result = await request
    .post("/micropub")
    .accept("application/json")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send({
      action: "update",
      url: response.header.location,
    });

  t.is(result.status, 400);
  t.is(
    result.body.error_description,
    "No replace, add or remove operations included in request"
  );

  server.close(t);
});
