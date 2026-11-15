import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media POST /media", () => {
  it("Returns 400 error for unsupported action", async () => {
    const result = await request
      .post("/media")
      .auth(testToken(), { type: "bearer" })
      .set("accept", "application/json")
      .send({ action: "foo" });

    assert.equal(result.status, 400);
    assert.equal(
      result.body.error_description,
      "Invalid value provided for: `action`",
    );
  });

  after(() => server.close());
});
