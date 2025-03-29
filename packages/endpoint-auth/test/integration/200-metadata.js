import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("endpoint-auth GET /auth/metadata", () => {
  it("Returns server metadata", async () => {
    const response = await request
      .get("/auth/metadata")
      .set("accept", "application/json");
    const result = response.body;
    const { host, protocol } = new URL(response.request.url);

    assert.ok(result.authorization_endpoint);
    assert.equal(result.code_challenge_methods_supported[0], "S256");
    assert.equal(result.issuer, `${protocol}//${host}`);
    assert.equal(result.response_types_supported[0], "code");
    assert.ok(result.scopes_supported);
    assert.ok(result.service_documentation);
    assert.ok(result.token_endpoint);
    assert.equal(result.ui_locales_supported, "en");
  });

  after(() => server.close());
});
