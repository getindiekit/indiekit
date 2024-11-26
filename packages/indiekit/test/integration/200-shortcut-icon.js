import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /assets/shortcut-icon-96-tick.png", () => {
  it("Returns JavaScript", async () => {
    const result = await request.get("/assets/shortcut-icon-96-tick.png");

    assert.equal(result.status, 200);
    assert.equal(result.type, "image/png");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
