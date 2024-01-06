import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";
import supertest from "supertest";
import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-media POST /media", () => {
  it("Returns 400 deleting file without a URL", async () => {
    const result = await request
      .post("/media")
      .accept("application/json")
      .auth(testToken(), { type: "bearer" })
      .send({
        action: "delete",
      });

    assert.equal(result.status, 400);
    assert.equal(result.body.error_description, "Missing parameter: `url`");
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
