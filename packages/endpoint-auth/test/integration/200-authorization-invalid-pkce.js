import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

await mockAgent("endpoint-auth");
const server = await testServer();
const request = supertest.agent(server);

/**
 * Request authorization with the given PKCE parameters
 * @param {object} pkce - PKCE parameters
 * @returns {Promise<import("supertest").Response>} Response
 */
const authorize = (pkce) =>
  request
    .get("/auth")
    .query({ client_id: "https://auth-endpoint.example" })
    .query({ redirect_uri: "https://auth-endpoint.example/redirect" })
    .query({ response_type: "code" })
    .query({ state: "12345" })
    .query(pkce);

describe("endpoint-auth GET /auth", () => {
  it("Returns documentation with invalid `code_challenge_method` error", async () => {
    const result = await authorize({
      code_challenge: "foobar",
      code_challenge_method: "plain",
    });

    assert.equal(result.status, 200);
    assert.equal(
      result.text.includes(
        "Invalid value provided for: <code>code_challenge_method</code>",
      ),
      true,
    );
  });

  it("Returns documentation with missing `code_challenge` error", async () => {
    const result = await authorize({ code_challenge_method: "S256" });

    assert.equal(result.status, 200);
    assert.equal(
      result.text.includes("Missing parameter: <code>code_challenge</code>"),
      true,
    );
  });

  it("Returns documentation with missing `code_challenge_method` error", async () => {
    const result = await authorize({ code_challenge: "foobar" });

    assert.equal(result.status, 200);
    assert.equal(
      result.text.includes(
        "Missing parameter: <code>code_challenge_method</code>",
      ),
      true,
    );
  });

  after(() => server.close());
});
