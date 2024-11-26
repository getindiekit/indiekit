import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /offline", () => {
  it("Displays offline page", async () => {
    const result = await request.get("/offline");

    assert.equal(result.status, 200);
    assert.equal(result.type, "text/html");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
