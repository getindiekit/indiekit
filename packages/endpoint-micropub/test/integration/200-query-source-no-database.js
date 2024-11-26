import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const server = await testServer({ mongodbUrl: false });
const request = supertest.agent(server);

describe("endpoint-micropub GET /micropub?q=source", () => {
  it("Returns empty list of published posts (no database)", async () => {
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
