import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /assets/app-icon-512-any.png", () => {
  it("Returns JavaScript", async () => {
    const result = await request.get("/assets/app-icon-512-any.png");

    assert.equal(result.status, 200);
    assert.equal(result.type, "image/png");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
