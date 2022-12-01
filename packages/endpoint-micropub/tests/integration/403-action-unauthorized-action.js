import test from "ava";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

test("Returns 403 error action not supported (by scope)", async (t) => {
  // Create post
  const server = await testServer();
  const request = supertest.agent(server);
  const response = await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
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
    .auth(testToken(), { type: "bearer" })
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
