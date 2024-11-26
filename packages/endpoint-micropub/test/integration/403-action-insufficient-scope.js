import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

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
          content: ["Foo bar."],
          category: ["test1", "test2"],
        },
      });
  });

  it("Returns 403 error action not supported (by scope)", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send({
        action: "foo",
        url: response.header.location,
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
