import process from "node:process";
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Posts content and redirects back to share page", async (t) => {
  nock("https://token-endpoint.example").get("/").reply(200, {
    me: process.env.TEST_PUBLICATION_URL,
    scope: "create",
  });
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar.md"))
    .reply(200, { commit: { message: "Message" } });

  // Publish post
  const request = await testServer();
  const result = await request
    .post("/share")
    .set("Cookie", [cookie])
    .send(`access_token=${process.env.TEST_TOKEN}`)
    .send("name=Foobar")
    .send("content=Test+of+sharing+a+bookmark")
    .send("bookmark-of=https://example.website");

  t.is(result.statusCode, 302);
});
