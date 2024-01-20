import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  it("Returns 501 error unsupported post type", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send({
        type: ["h-entry"],
        properties: {
          name: ["Foobar"],
          content: ["I ate a cheese sandwich, which was nice."],
        },
      });

    assert.equal(result.status, 501);
    assert.equal(
      result.body.error_description,
      "No configuration provided for article post type",
    );
    assert.equal(
      result.body.error_uri,
      "https://getindiekit.com/configuration/post-types",
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
