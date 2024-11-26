import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub GET /micropub?q=category", () => {
  it("Returns categories", async () => {
    const response = await request
      .get("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "category" });

    assert.ok(response.body.categories);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
