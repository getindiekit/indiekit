import { strict as assert } from "node:assert";
import { after, before, describe, it } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  let response;

  before(async () => {
    // Create post
    response = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .send({
        type: ["h-entry"],
        properties: {
          name: ["Foobar"],
        },
      });

    // Delete post
    await request.post("/micropub").auth(testToken(), { type: "bearer" }).send({
      action: "delete",
      url: response.header.location,
    });
  });

  it("Un-deletes post", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .send({
        action: "undelete",
        url: response.header.location,
      });

    assert.equal(result.status, 200);
    assert.match(result.body.success_description, /\bPost restored\b/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
