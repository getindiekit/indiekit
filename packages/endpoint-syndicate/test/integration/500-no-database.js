import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer({ mongodbUrl: false });
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

  it("Returns 501 error as feature requires database", async () => {
    const result = await request
      .post("/syndicate")
      .set("accept", "application/json")
      .query({ url: "https://website.example/notes/foobar/" })
      .query({ token: testToken() });

    assert.equal(result.status, 501);
    assert.equal(
      result.body.error_description,
      "This feature requires a database",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
