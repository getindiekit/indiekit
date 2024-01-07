import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /app.webmanifest", () => {
  it("Returns Web App Manifest", async () => {
    const result = await request.get("/app.webmanifest");

    assert.equal(result.status, 200);
    assert.equal(result.type, "application/manifest+json");
    assert.equal(result.body.name, "Test configuration");
    assert.ok(result.body.icons);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
