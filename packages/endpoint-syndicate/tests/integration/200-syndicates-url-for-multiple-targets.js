import test from "ava";
import sinon from "sinon";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-syndicate");

test("Syndicates a URL to multiple targets (one fails)", async (t) => {
  sinon.stub(console, "error");

  const server = await testServer({
    plugins: [
      "@indiekit/syndicator-internet-archive",
      "@indiekit/syndicator-mastodon",
    ],
  });
  const request = supertest.agent(server);
  await request
    .post("/micropub")
    .auth(testToken(), { type: "bearer" })
    .set("accept", "application/json")
    .set("cookie", [testCookie()])
    .send({
      type: ["h-entry"],
      properties: {
        name: ["foobar"],
        "mp-syndicate-to": [
          "https://web.archive.org/",
          "https://mastodon.example/@username",
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
    "Post updated at https://website.example/notes/foobar/. The following target(s) did not return a URL: https://web.archive.org/"
  );

  server.close(t);
});
