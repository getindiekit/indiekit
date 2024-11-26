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

  it("Updates post", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .send({
        action: "update",
        url: response.header.location,
        replace: {
          name: ["Barfoo"],
        },
      });

    assert.equal(result.status, 200);
    assert.match(result.headers.location, /\bfoobar\b/);
    assert.match(result.body.success_description, /\bPost updated\b/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
