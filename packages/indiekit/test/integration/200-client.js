import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /id", () => {
  it("Returns client metadata", async () => {
    const result = await request.get("/id");

    assert.equal(result.status, 200);
    assert.equal(result.type, "application/json");
    assert.equal(result.body.client_id.includes("/id"), true);
    assert.equal(result.body.client_name, "Test configuration");
    assert.ok(result.body.client_uri);
    assert.equal(result.body.logo_uri.includes("app-icon-512-any.png"), true);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
