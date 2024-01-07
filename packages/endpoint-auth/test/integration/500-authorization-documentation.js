import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth", () => {
  it("Returns service documentation if no authorization query", async () => {
    const result = await request.get("/auth").set("accept", "application/json");

    assert.equal(result.status, 500);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
