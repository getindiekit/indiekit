import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /feed.jf2", () => {
  it("Returns JF2 Feed", async () => {
    const result = await request.get("/feed.jf2");

    assert.equal(result.status, 200);
    assert.equal(result.type, "application/jf2feed+json");
    assert.equal(result.body.name, "Test configuration");
    assert.deepEqual(result.body.children, []);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
