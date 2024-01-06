import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media POST /media?q=foo", () => {
  it("Returns 501 error unsupported parameter provided", async () => {
    const result = await request
      .get("/media")
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
