import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /assets/app.css", () => {
  it("Returns CSS", async () => {
    const result = await request.get("/assets/app.css");

    assert.equal(result.status, 200);
    assert.equal(result.type, "text/css");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
