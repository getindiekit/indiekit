import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth/consent", () => {
  it("Returns 400 with no `request_uri`", async () => {
    const result = await request
      .get("/auth/consent")
      .query({ request_uri: "urn:ietf:params:oauth:request_uri:foobar" });

    assert.equal(result.status, 400);
    assert.equal(
      result.text.includes(
        "Invalid value provided for: <code>request_uri</code>",
      ),
      true,
    );
  });

  after(() => server.close());
});
