import test from "ava";
import nock from "nock";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("store");

test("Syndicates a URL", async (t) => {
  nock("https://api.twitter.com")
    .post("/1.1/statuses/update.json")
    .reply(200, {
      id_str: "1234567890987654321", // eslint-disable-line camelcase
      user: { screen_name: "username" }, // eslint-disable-line camelcase
    });

  const server = await testServer({
    plugins: ["@indiekit/syndicator-twitter"],
  });
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .send("h=entry")
    .send("name=foobar")
    .send("mp-syndicate-to=https://twitter.com/username");
  const result = await request
    .post("/syndicate")
    .set("accept", "application/json")
    .send({
      syndication: {
        url: "https://website.example/notes/foobar/",
        redirect_uri: "/posts/12345",
      },
    })
    .send({ token: testToken() });

  t.is(result.status, 302);
  t.is(
    result.headers.location,
    "/posts/12345?success=Post%20updated%20at%20https%3A%2F%2Fwebsite.example%2Fnotes%2Ffoobar%2F"
  );

  server.close(t);
});
