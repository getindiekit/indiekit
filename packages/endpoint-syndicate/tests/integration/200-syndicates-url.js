import process from "node:process";
import test from "ava";
import nock from "nock";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";

test("Syndicates a URL", async (t) => {
  nock("https://api.github.com")
    .put((uri) => uri.includes("foobar"))
    .twice()
    .reply(200);
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .reply(200, {
      id_str: "1234567890987654321", // eslint-disable-line camelcase
      user: { screen_name: "username" }, // eslint-disable-line camelcase
    });

  // Create post
  const request = await testServer();
  await request
    .post("/micropub")
    .auth(process.env.TEST_TOKEN, { type: "bearer" })
    .set("accept", "application/json")
    .set("cookie", [cookie])
    .send("h=entry")
    .send("name=foobar")
    .send("mp-syndicate-to=https://twitter.com/username");

  // Syndicate post
  const result = await request
    .post("/syndicate")
    .set("accept", "application/json")
    .query(`url=${process.env.TEST_PUBLICATION_URL}notes/foobar/`)
    .query(`token=${process.env.TEST_TOKEN}`);

  // Assertions
  t.is(result.status, 200);
  t.is(
    result.body.success_description,
    `Post updated at ${process.env.TEST_PUBLICATION_URL}notes/foobar/`
  );
});
