import process from "node:process";
import "dotenv/config.js"; // eslint-disable-line import/no-unassigned-import
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Updates post", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar"))
    .twice()
    .reply(200);
  const request = await testServer();

  // Create post
  const response = await request
    .post("/micropub")
    .auth(process.env.TEST_BEARER_TOKEN, { type: "bearer" })
    .send({
      type: ["h-entry"],
      properties: {
        name: ["Foobar"],
      },
    });

  // Update post
  const result = await request
    .post("/micropub")
    .auth(process.env.TEST_BEARER_TOKEN, { type: "bearer" })
    .send({
      action: "update",
      url: response.header.location,
      replace: {
        name: ["Barfoo"],
      },
    });

  t.is(result.statusCode, 200);
  t.regex(result.headers.location, /\bfoobar\b/);
  t.regex(result.body.success_description, /\bPost updated\b/);
});
