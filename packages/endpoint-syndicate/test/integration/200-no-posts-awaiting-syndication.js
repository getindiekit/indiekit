import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
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
  it("Returns no post records awaiting syndication", async () => {
    await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send("h=entry")
      .send("name=foobar");
    const result = await request
      .post("/syndicate")
      .query({ token: testToken() })
      .set("accept", "application/json");

    assert.equal(result.status, 200);
    assert.equal(
      result.body.success_description,
      "No posts awaiting syndication",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
