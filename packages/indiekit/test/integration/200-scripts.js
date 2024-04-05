import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /assets/app-[hash].js", () => {
  it("Returns JavaScript", async () => {
    const result = await request.get("/assets/app-[hash].js");

    assert.equal(result.status, 200);
    assert.equal(result.type, "text/javascript");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
