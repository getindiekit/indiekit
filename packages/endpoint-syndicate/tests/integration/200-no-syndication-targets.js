import process from "node:process";
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";

test("Returns 200 if no post records", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar"))
    .twice()
    .reply(200);
  const request = await testServer({ useSyndicator: false });

  // Create post
  await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=foobar")
    .send("mp-syndicate-to=https://twitter.com/username");

  const result = await request
    .post("/syndicate")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json");

  t.is(result.status, 200);
  t.is(
    result.body.success_description,
    "No syndication targets have been configured"
  );
});
