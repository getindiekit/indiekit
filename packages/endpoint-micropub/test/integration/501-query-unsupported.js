import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub GET /micropub?q=foo", () => {
  it("Returns 501 error unsupported parameter provided", async () => {
    const result = await request
      .get("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .query({ q: "foo" });

    assert.equal(result.status, 501);
    assert.equal(
      result.body.error_description,
      "Unsupported query for `q`: `foo`",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
