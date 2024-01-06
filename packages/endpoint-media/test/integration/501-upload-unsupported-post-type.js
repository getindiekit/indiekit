import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer({ usePreset: false });
const request = supertest.agent(server);

describe("endpoint-media POST /media", () => {
  it("Returns 501 error unsupported post type", async () => {
    const result = await request
      .post("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .attach("file", getFixture("file-types/photo.jpg", false), "photo.jpg");

    assert.equal(result.status, 501);
    assert.equal(
      result.body.error_description,
      "No configuration provided for photo post type",
    );
    assert.equal(
      result.body.error_uri,
      "https://getindiekit.com/configuration/post-types",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
