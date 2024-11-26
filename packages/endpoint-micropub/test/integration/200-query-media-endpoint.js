import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub GET /micropub?q=media-endpoint", () => {
  it("Returns media endpoint", async () => {
    const response = await request
      .get("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "media-endpoint" });

    assert.ok(response.body["media-endpoint"]);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
