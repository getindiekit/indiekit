import process from "node:process";
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Returns 422 if error publishing post", async (t) => {
  nock("https://token-endpoint.example").get("/").reply(200, {
    me: process.env.TEST_PUBLICATION_URL,
    scope: "foo",
  });
  const request = await testServer();

  const result = await request
    .post("/share")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .send("name=Foobar")
    .send("content=Test+of+sharing+a+bookmark")
    .send("bookmark-of=https://example.website");

  t.is(result.status, 422);
});
