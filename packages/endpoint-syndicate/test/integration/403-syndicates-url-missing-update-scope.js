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
const token = testToken({ scope: "create" });

describe("endpoint-syndicate POST /syndicate", () => {
  before(async () => {
    await request
      .post("/micropub")
      .auth(token, { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=foobar")
      .send("mp-syndicate-to=https://mastodon.example/@username");
  });

  it("Returns 403 error syndicating a URL", async () => {
    const result = await request
      .post("/syndicate")
      .set("accept", "application/json")
      .send({
        syndication: {
          url: "https://website.example/notes/foobar/",
          redirect_uri: "/posts/12345",
        },
        access_token: token,
      });

    assert.equal(result.status, 403);
    assert.equal(
      result.body.error_description,
      "The request requires higher privileges than provided by the access token",
    );
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
