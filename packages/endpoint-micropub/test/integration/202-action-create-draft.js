import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

await mockAgent("endpoint-micropub");
const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  it("Creates draft post (JSON)", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken({ scope: "draft" }), { type: "bearer" })
      .send({
        type: ["h-entry"],
        properties: {
          name: ["Foobar"],
          content: [
            "Micropub test of creating an h-entry with a JSON request containing multiple categories.",
          ],
          category: ["test1", "test2"],
        },
      });

    assert.equal(result.status, 202);
    assert.match(result.headers.location, /\bfoobar\b/);
    assert.match(result.body.success_description, /\bPost will be created\b/);
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
