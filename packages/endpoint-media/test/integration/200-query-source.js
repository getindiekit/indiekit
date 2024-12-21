import { strict as assert } from "node:assert";
import { before, after, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const { client, mongoServer, mongoUri } = await testDatabase();
const server = await testServer({
  application: { mongodbUrl: mongoUri },
});
const request = supertest.agent(server);

describe("endpoint-media GET /media?q=source", () => {
  before(async () => {
    await request
      .post("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");
  });

  it("Returns list of uploaded files", async () => {
    const result = await request
      .get("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "source" });

    assert.ok(result.body.items[0].uid);
    assert.equal(result.body.items[0]["content-type"], "image/jpeg");
    assert.equal(result.body.items[0]["media-type"], "photo");
    assert.ok(result.body.items[0].published);
    assert.equal(
      result.body.items[0].url.startsWith("https://website.example"),
      true,
    );
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => process.exit(error ? 1 : 0));
  });
});
