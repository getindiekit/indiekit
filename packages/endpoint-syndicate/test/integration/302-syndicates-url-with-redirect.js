import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-syndicate");
const server = await testServer({
  plugins: ["@indiekit/syndicator-mastodon"],
});
const request = supertest.agent(server);

describe("endpoint-syndicate POST /syndicate", () => {
  before(async () => {
    await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=foobar")
      .send("mp-syndicate-to=https://mastodon.example/@username");
  });

  it("Syndicates a URL and redirects", async () => {
    const result = await request
      .post("/syndicate")
      .set("accept", "application/json")
      .send({
        syndication: {
          url: "https://website.example/notes/foobar/",
          redirect_uri: "/posts/12345",
        },
        access_token: testToken(),
      });

    assert.equal(result.status, 302);
    assert.equal(
      result.headers.location,
      "/posts/12345?success=Post%20updated%20at%20https%3A%2F%2Fwebsite.example%2Fnotes%2Ffoobar%2F",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
