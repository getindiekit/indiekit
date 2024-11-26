import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  it("Returns 404 error post not found performing action", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send({
        action: "delete",
        url: "https://website.example/foo",
      });

    assert.equal(result.status, 404);
    assert.equal(
      result.body.error_description,
      "No database record found for https://website.example/foo",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
