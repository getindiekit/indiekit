import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /status", () => {
  it("Status redirects unauthorized user to login page", async () => {
    const result = await request.get("/status");

    assert.equal(result.header.location, "/session/login?redirect=/status");
    assert.equal(result.status, 302);
  });

  after(() => server.close());
});
