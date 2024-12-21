import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  it("Returns 400 deleting post without a URL", async () => {
    const result = await request
      .post("/micropub")
      .accept("application/json")
      .auth(testToken(), { type: "bearer" })
      .send({
        action: "delete",
      });

    assert.equal(result.status, 400);
    assert.equal(result.body.error_description, "Missing parameter: `url`");
  });

  after(() => server.close());
});
