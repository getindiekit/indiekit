import test from "ava";
import nock from "nock";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { cookie } from "@indiekit-test/session";
import { testToken } from "@indiekit-test/token";

await mockAgent("store");

test("Syndicates a URL", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .reply(200, {
      id_str: "1234567890987654321", // eslint-disable-line camelcase
      user: { screen_name: "username" }, // eslint-disable-line camelcase
    });

  const server = await testServer();
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .set("cookie", [cookie])
    .send("h=entry")
    .send("name=foobar")
    .send("mp-syndicate-to=https://twitter.com/username");
  const result = await request
    .post("/syndicate")
    .set("accept", "application/json")
    .query({ url: "https://website.example/notes/foobar/" })
    .query({ token: testToken() });

  t.is(result.status, 200);
  t.is(
    result.body.success_description,
    "Post updated at https://website.example/notes/foobar/"
  );

  server.close(t);
});
