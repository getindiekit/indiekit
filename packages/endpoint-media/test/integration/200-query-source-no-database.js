import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer({ useDatabase: false });
const request = supertest.agent(server);

describe("endpoint-media GET /media?q=source", () => {
  it("Returns empty list of uploaded files (no database)", async () => {
    const result = await request
      .get("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "source" });

    assert.deepEqual(result.body.items, []);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
