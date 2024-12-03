import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

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

describe("endpoint-media POST /media", async () => {
  it("Returns 403 error token has insufficient scope", async () => {
    const result = await request
      .post("/media")
      .auth(testToken({ scope: "foo" }), { type: "bearer" })
      .set("accept", "application/json")
      .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

    assert.equal(result.status, 403);
    assert.equal(
      result.body.error_description,
      "The request requires higher privileges than provided by the access token",
    );
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
    server.close((error) => {
      process.exit(error ? 1 : 0);
    });
  });
});
