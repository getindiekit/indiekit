import process from "node:process";
import test from "ava";
import mockSession from "mock-session";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Posts content and redirects back to share page", async (t) => {
  nock("https://tokens.indieauth.com").get("/token").reply(200, {
    me: process.env.TEST_PUBLICATION_URL,
    scope: "create",
  });
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar.md"))
    .reply(200, { commit: { message: "Message" } });

  // Publish post
  const request = await testServer();
  const cookie = mockSession("test", process.env.TEST_SESSION_SECRET, {
    token: process.env.TEST_BEARER_TOKEN,
  });
  const result = await request
    .post("/share")
    .set("Cookie", [cookie])
    .send(`access_token=${process.env.TEST_BEARER_TOKEN}`)
    .send("name=Foobar")
    .send("content=Test+of+sharing+a+bookmark")
    .send("bookmark-of=https://example.website");

  t.is(result.statusCode, 302);
});
