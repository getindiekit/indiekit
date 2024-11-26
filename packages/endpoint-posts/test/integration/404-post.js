import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import { testToken } from "@indiekit-test/token";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-posts GET /posts/:uid", () => {
  it("Returns 404 error post not found", async () => {
    const result = await request
      .get("/posts/404")
      .auth(testToken(), { type: "bearer" });

    assert.equal(result.status, 404);
    assert.equal(
      result.text.includes(
        "If you entered a web address please check it was correct",
      ),
      true,
    );
  });

  after(() => {
    server.close(() => process.exit(0));
  });
});
