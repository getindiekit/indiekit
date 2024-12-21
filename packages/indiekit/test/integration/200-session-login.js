import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /session/login", () => {
  it("Returns login page", async () => {
    const result = await request.get("/session/login");

    assert.equal(result.headers["x-robots-tag"], "noindex");
    assert.equal(result.status, 200);
    assert.equal(result.type, "text/html");
  });

  after(() => server.close());
});
