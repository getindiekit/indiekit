import process from "node:process";
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Creates post (form-encoded)", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar"))
    .reply(200);
  const request = await testServer();

  const result = await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=Foobar")
    .send("content=Micropub+test+of+creating+an+h-entry+with+categories")
    .send("photo=https%3A%2F%2Fwebsite.example%2Fphoto.jpg")
    .send("category[]=test1&category[]=test2");

  t.is(result.status, 202);
  t.regex(result.headers.location, /\bfoobar\b/);
  t.regex(result.body.success_description, /\bPost will be created\b/);
});
