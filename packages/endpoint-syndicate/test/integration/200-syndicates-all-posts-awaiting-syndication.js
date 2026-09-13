import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-syndicate");
const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
  plugins: ["@indiekit/syndicator-mastodon"],
});
const request = supertest.agent(server);

describe("endpoint-syndicate POST /syndicate", () => {
  before(async () => {
    for (const name of ["foo", "bar"]) {
      await request
        .post("/micropub")
        .auth(testToken(), { type: "bearer" })
        .set("accept", "application/json")
        .send("h=entry")
        .send(`name=${name}`)
        .send("mp-syndicate-to=https://mastodon.example/@username");
    }
  });

  it("Syndicates every post awaiting syndication, oldest first", async () => {
    const result = await request
      .post("/syndicate")
      .query({ token: testToken() })
      .set("accept", "application/json");

    assert.equal(result.status, 200);
    assert.equal(result.body.success_description, "Syndicated 2 posts");
    assert.deepEqual(
      result.body.results.map((post) => post.url),
      [
        "https://website.example/notes/foo/",
        "https://website.example/notes/bar/",
      ],
    );
    assert.deepEqual(
      result.body.results.map((post) => post.success_description),
      [
        "Post updated at https://website.example/notes/foo/",
        "Post updated at https://website.example/notes/bar/",
      ],
    );
  });

  it("Has nothing left to syndicate afterwards", async () => {
    const result = await request
      .post("/syndicate")
      .query({ token: testToken() })
      .set("accept", "application/json");

    assert.equal(
      result.body.success_description,
      "No posts awaiting syndication",
    );
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
