import process from "node:process";
import test from "ava";
import nock from "nock";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

test("Updates post", async (t) => {
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
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send({
      action: "update",
      url: response.header.location,
      replace: {
        name: ["Barfoo"],
      },
    });

  t.is(result.status, 200);
  t.regex(result.headers.location, /\bfoobar\b/);
  t.regex(result.body.success_description, /\bPost updated\b/);

  server.close(t);
});
