import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub GET /micropub?q=config", () => {
  it("Returns config", async () => {
    const response = await request
      .get("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "config" });

    assert.ok(response.body["media-endpoint"]);
    assert.ok(response.body["post-types"]);
    assert.ok(response.body["syndicate-to"]);
    assert.ok(response.body.q);
  });

  after(() => server.close());
});
