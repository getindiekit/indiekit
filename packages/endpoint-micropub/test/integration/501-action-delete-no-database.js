import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  it("Returns 501 error deleting post without a database", async () => {
    const result = await request
      .post("/micropub")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send({
        action: "delete",
        url: "https://website.example/foo",
      });

    assert.equal(result.status, 501);
    assert.equal(
      result.body.error_description,
      "This feature requires a database",
    );
    assert.equal(result.body.error_uri, undefined);
  });

  after(() => server.close());
});
