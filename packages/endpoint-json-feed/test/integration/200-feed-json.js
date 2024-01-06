import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

const server = await testServer({
  plugins: ["@indiekit/endpoint-json-feed"],
});
const request = supertest.agent(server);

describe("endpoint-json-feed GET /feed.json", () => {
  it("Returns JSON Feed", async () => {
    const result = await request.get("/feed.json");

    assert.equal(result.status, 200);
    assert.equal(result.type, "application/feed+json");
    assert.equal(result.body.title, "Test configuration");
    assert.deepEqual(result.body.items, []);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
