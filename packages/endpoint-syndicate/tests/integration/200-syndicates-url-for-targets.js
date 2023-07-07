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
      id_str: "1234567890987654321",
      user: { screen_name: "username" },
    });

  nock("https://social.example").post("/api/v1/statuses").reply(200, {
    emojis: [],
    id: "1234567890987654321",
    media_attachments: [],
    mentions: [],
    tags: [],
    url: "https://social.example/@username/1234567890987654321",
  });

  const server = await testServer({
    plugins: ["@indiekit/syndicator-mastodon", "@indiekit/syndicator-twitter"],
  });
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .set("cookie", [cookie()])
    .send({
      type: ["h-entry"],
      properties: {
        name: ["foobar"],
        "mp-syndicate-to": [
          "https://twitter.com/username",
          "https://social.example/@username",
        ],
      },
    });
  const result = await request
    .post("/syndicate")
    .set("accept", "application/json")
    .query({ source_url: "https://website.example/notes/foobar/" })
    .query({ token: testToken() });

  t.is(result.status, 200);
  t.is(
    result.body.success_description,
    "Post updated at https://website.example/notes/foobar/"
  );

  server.close(t);
});
