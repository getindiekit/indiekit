import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

await mockAgent("indiekit");

const server = await testServer({
  application: {
    tokenEndpoint: "https://token-endpoint.example",
    introspectionEndpoint: "https://token-endpoint.example/introspect",
  },
});

describe("endpoint-micropub GET /micropub", () => {
  it("Returns 403 error when me does not match publication in api GET request", async () => {
    const result = await supertest(server)
      .get("/micropub")
      .auth("another", { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "config" });

    assert.equal(result.status, 403);
  });

  after(() => server.close());
});
