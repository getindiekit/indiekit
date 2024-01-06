import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub GET /micropub?foo=bar", () => {
  it("Returns 400 error query parameter not provided", async () => {
    const result = await request
      .get("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ foo: "bar" });

    assert.equal(result.status, 400);
    assert.equal(result.body.error_description, "Missing parameter: `q`");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
