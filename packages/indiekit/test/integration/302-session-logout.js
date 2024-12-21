import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /session/login", () => {
  it("Logout redirects to homepage", async () => {
    const result = await request.get("/session/logout");

    assert.equal(result.header.location, "/");
    assert.equal(result.status, 302);
  });

  after(() => server.close());
});
