import { strict as assert } from "node:assert";
import { after, before, describe, it, mock } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testCookie } from "@indiekit-test/session";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-syndicate");
const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
  plugins: [
    "@indiekit/syndicator-internet-archive",
    "@indiekit/syndicator-mastodon",
  ],
});
const request = supertest.agent(server);

describe("endpoint-syndicate POST /syndicate", () => {
  before(async () => {
    await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .set("cookie", testCookie())
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
  });

  it("Syndicates a URL to multiple targets (one fails)", async () => {
    mock.method(console, "error", () => {});

    const result = await request
      .post("/syndicate")
      .set("accept", "application/json")
      .query({ source_url: "https://website.example/notes/foobar/" })
      .query({ token: testToken() });

    assert.equal(result.status, 200);
    assert.equal(
      result.body.success_description,
      "Post updated at https://website.example/notes/foobar/. The following target(s) did not return a URL: https://web.archive.org/",
    );
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
