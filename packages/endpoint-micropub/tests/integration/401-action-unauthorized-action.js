import process from "node:process";
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Returns 401 if action is not supported (by scope)", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar.md"))
    .reply(200);
  const request = await testServer();

  // Create post
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
    .set("Accept", "application/json")
    .send({
      action: "foo",
      url: response.header.location,
    });

  t.is(result.statusCode, 401);
  t.is(
    result.body.error_description,
    "The scope of this token does not meet the requirements for this request"
  );
});
