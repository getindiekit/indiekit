import process from "node:process";
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Deletes post", async (t) => {
  nock.enableNetConnect("127.0.0.1");
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar.md"))
    .reply(200);
  nock("https://api.github.com")
    .get((uri) => uri.includes("foobar.md"))
    .reply(200);
  nock("https://api.github.com")
    .delete((uri) => uri.includes("foobar.md"))
    .reply(200);
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
      },
    });

  // Delete post
  await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send({
      action: "delete",
      url: response.header.location,
    });

  // Undelete post
  const result = await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send({
      action: "undelete",
      url: response.header.location,
    });

  t.is(result.status, 200);
  t.regex(result.body.success_description, /\bPost undeleted\b/);
});
