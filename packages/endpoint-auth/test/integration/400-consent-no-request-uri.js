import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth/consent", () => {
  it("Returns 400 with no `request_uri`", async () => {
    const result = await request.get("/auth/consent");

    assert.equal(result.status, 400);
    assert.equal(
      result.text.includes("Missing parameter: <code>request_uri</code>"),
      true,
    );
  });

  after(() => server.close());
});
