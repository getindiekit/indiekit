import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { getFixture } from "@indiekit-test/fixtures";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media POST /media", () => {
  it("Returns 400 error several files included in request", async () => {
    const photo = getFixture("file-types/photo.jpg", false);
    const result = await request
      .post("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .attach("file", photo, "photo1.jpg")
      .attach("file", photo, "photo2.jpg");

    assert.equal(result.status, 400);
    assert.equal(
      result.body.error_description,
      "Invalid value provided for: `file`",
    );
  });

  after(() => server.close());
});
