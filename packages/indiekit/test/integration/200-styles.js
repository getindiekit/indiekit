import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /assets/app-[hash].css", () => {
  it("Returns CSS", async () => {
    const result = await request.get("/assets/app-[hash].css");

    assert.equal(result.status, 200);
    assert.equal(result.type, "text/css");
  });

  after(() => server.close());
});
