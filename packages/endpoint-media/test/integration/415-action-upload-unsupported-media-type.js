import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media POST /media", () => {
  it("Returns 415 error unsupported media type", async () => {
    const result = await request
      .post("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .attach("file", getFixture("file-types/font.ttf", false), "font.ttf");

    assert.equal(result.status, 415);
    assert.equal(
      result.body.error_description,
      "The font media type is not supported",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
