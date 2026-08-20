import { strict as assert } from "node:assert";
import { after, describe, it } from "node:test";

import { testServer } from "@indiekit-test/server";
import supertest from "supertest";

const server = await testServer();
const request = supertest.agent(server);

describe("indiekit GET /session/auth", () => {
  it("Returns 403 error auth with invalid redirect", async () => {
    const result = await request
      .get("/session/auth")
      .query({ redirect: "https://external.example" });

    assert.equal(result.status, 403);
    assert.equal(result.text.includes("Invalid redirect attempted"), true);
  });

  // A protocol-relative URL is resolved by the browser as an absolute one, so
  // //external.example redirects off-site just as https://external.example does.
  for (const redirect of [
    "//external.example",
    "///external.example",
    "//user@external.example",
    String.raw`/\external.example`,
  ]) {
    it(`Returns 403 error auth with off-site redirect ${redirect}`, async () => {
      const result = await request.get("/session/auth").query({ redirect });

      assert.equal(result.status, 403);
      assert.equal(result.text.includes("Invalid redirect attempted"), true);
    });
  }

  // Paths containing characters beyond `[\w&/=?]` are local and permitted; the
  // request then fails on the missing code, not on the redirect.
  for (const redirect of [
    "/auth/new-password",
    "/files/upload-photos",
    "/posts/2026%2F08",
  ]) {
    it(`Allows local redirect ${redirect}`, async () => {
      const result = await request.get("/session/auth").query({ redirect });

      assert.notEqual(result.status, 403);
    });
  }

  after(() => server.close());
});
