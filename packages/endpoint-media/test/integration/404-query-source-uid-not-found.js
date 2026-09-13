import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media GET /media?q=source&uid=*", () => {
  it("Returns 404 error uid not found", async () => {
    const result = await request
      .get("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "source" })
      .query({ uid: "unknown-uid" });

    assert.equal(result.status, 404);
    assert.equal(
      result.body.error_description,
      "No database record found for file",
    );
  });

  after(() => server.close());
});
