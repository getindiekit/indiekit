import test from "ava";
import nock from "nock";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-syndicate");

test("Syndicates a URL and redirects", async (t) => {
  nock("https://mastodon.example").post("/api/v1/statuses").reply(200, {
    url: "https://mastodon.example/@username/1234567890987654321",
  });

  const access_token = testToken({ scope: "create" });
  const server = await testServer({
    plugins: ["@indiekit/syndicator-mastodon"],
  });
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(access_token, { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=foobar")
    .send("mp-syndicate-to=https://social.com/@username");
  const result = await request
    .post("/syndicate")
    .set("accept", "application/json")
    .send({
      syndication: {
        url: "https://website.example/notes/foobar/",
        redirect_uri: "/posts/12345",
      },
      access_token,
    });

  t.is(result.status, 403);
  t.is(
    result.body.error_description,
    "The request requires higher privileges than provided by the access token"
  );

  server.close(t);
});
