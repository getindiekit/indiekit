import process from "node:process";
import test from "ava";
import nock from "nock";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Returns 403 error action not supported (by scope)", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar.md"))
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
        content: ["Foo bar."],
        category: ["test1", "test2"],
      },
    });

  // Perform unknown action
  const result = await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .send({
      action: "foo",
      url: response.header.location,
    });

  t.is(result.status, 403);
  t.is(
    result.body.error_description,
    "The request requires higher privileges than provided by the access token"
  );

  server.close(t);
});
