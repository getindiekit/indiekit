import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer({
  plugins: ["@indiekit/syndicator-mastodon"],
});
const request = supertest.agent(server);

describe("endpoint-syndicate POST /syndicate", () => {
  it("Returns no post record for URL", async () => {
    const result = await request
      .post("/syndicate")
      .query({ token: testToken() })
      .set("accept", "application/json")
      .query({ source_url: "https://website.example/notes/foobar/" });

    assert.equal(result.status, 200);
    assert.equal(
      result.body.success_description,
      `No post record available for https://website.example/notes/foobar/`,
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
