import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub GET /micropub?q=post-types", () => {
  it("Returns available post types", async () => {
    const response = await request
      .get("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "post-types" });

    assert.ok(response.body["post-types"]);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
