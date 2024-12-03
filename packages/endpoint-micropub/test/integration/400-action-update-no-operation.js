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
      .auth(testToken(), { type: "bearer" })
      .send({
        type: ["h-entry"],
        properties: {
          name: ["Foobar"],
        },
      });
  });

  it("Returns 400 updating post without operation to perform", async () => {
    const result = await request
      .post("/micropub")
      .accept("application/json")
      .auth(testToken(), { type: "bearer" })
      .send({
        action: "update",
        url: response.header.location,
      });

    assert.equal(result.status, 400);
    assert.equal(
      result.body.error_description,
      "No replace, add or remove operations included in request",
    );
  });

  after(() => server.close());
});
