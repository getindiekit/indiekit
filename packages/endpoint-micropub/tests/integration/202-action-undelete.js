import process from "node:process";
import test from "ava";
import nock from "nock";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Un-deletes post", async (t) => {
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

  server.close(t);
});
