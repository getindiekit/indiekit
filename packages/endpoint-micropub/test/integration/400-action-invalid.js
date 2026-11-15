import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-micropub POST /micropub", () => {
  it("Returns 400 error for unsupported action", async () => {
    // Scope includes the action, so the request isn’t rejected as forbidden
    const result = await request
      .post("/micropub")
      .accept("application/json")
      .auth(testToken({ scope: "create foo" }), { type: "bearer" })
      .send({ action: "foo", url: "https://website.example/foo" });

    assert.equal(result.status, 400);
    assert.equal(
      result.body.error_description,
      "Invalid value provided for: `action`",
    );
  });

  after(() => server.close());
});
