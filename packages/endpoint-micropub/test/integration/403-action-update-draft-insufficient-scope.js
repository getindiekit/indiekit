import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  let response;

  before(async () => {
    response = await request
      .post("/micropub")
      .auth(testToken({ scope: "create" }), { type: "bearer" })
      .send({
        type: ["h-entry"],
        properties: {
          name: ["Foobar"],
        },
      });
  });

  it("Returns 403 error update non-draft post with draft scope", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken({ scope: "draft" }), { type: "bearer" })
      .set("accept", "application/json")
      .send({
        action: "update",
        url: response.header.location,
        replace: {
          name: ["foo"],
        },
      });

    assert.equal(result.status, 403);
    assert.equal(
      result.body.error_description,
      "The request requires higher privileges than provided by the access token",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
