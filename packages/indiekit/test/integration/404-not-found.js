import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /not-found", () => {
  it("Returns 404", async () => {
    const result = await request
      .get("/not-found")
      .auth(testToken(), { type: "bearer" });

    assert.equal(result.status, 404);
  });

  after(() => server.close());
});
