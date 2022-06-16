import process from "node:process";
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Deletes post", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar.md"))
    .reply(200);
  nock("https://api.github.com")
    .get((uri) => uri.includes("foobar.md"))
    .reply(200);
  nock("https://api.github.com")
    .delete((uri) => uri.includes("foobar.md"))
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
        content: [
          "Micropub test of creating an h-entry with a JSON request containing multiple categories.",
        ],
        category: ["test1", "test2"],
      },
    });

  // Delete post
  const result = await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send({
      action: "delete",
      url: response.header.location,
    });

  t.is(result.status, 200);
  t.regex(result.body.success_description, /\bPost deleted\b/);
});
