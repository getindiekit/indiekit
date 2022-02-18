import process from "node:process";
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Returns 400 if source URL can’t be found", async (t) => {
  nock("https://website.example").get("/post.html").replyWithError("Not found");
  const request = await testServer();

  const result = await request
    .get("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("Accept", "application/json")
    .query("q=source&properties[]=name&url=https://website.example/post.html");

  t.is(result.statusCode, 400);
  t.is(result.body.error_description, "Not found");
});
