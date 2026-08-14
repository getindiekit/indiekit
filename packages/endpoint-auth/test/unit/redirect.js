import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";

import { validateRedirect } from "../../lib/redirect.js";

await mockAgent("endpoint-auth");

const origin = "https://auth-endpoint.example";

describe("endpoint-auth/lib/redirect", () => {
  it("Validates `redirect_uri`", async () => {
    assert.equal(
      await validateRedirect(
        "https://client.example:3000",
        "https://client.example:3000/redirect",
      ),
      true,
    );
    assert.equal(
      await validateRedirect(
        "https://client.example:3000",
        "https://client.example:8080/redirect",
      ),
      false,
    );
    assert.equal(
      await validateRedirect(
        "https://client.example",
        "https://www.client.example/redirect",
      ),
      false,
    );
  });

  it("Validates `redirect_uri` declared in `<link>` tag", async () => {
    assert.equal(
      await validateRedirect(
        "https://redirect.example/callback",
        `${origin}/declares-redirect`,
      ),
      true,
    );
  });

  it("Validates `redirect_uri` declared in `Link` header", async () => {
    assert.equal(
      await validateRedirect(
        "https://redirect.example/callback",
        `${origin}/declares-redirect-header`,
      ),
      true,
    );
  });

  it("Invalidates `redirect_uri` not declared at `client_id`", async () => {
    assert.equal(
      await validateRedirect(
        "https://attacker.example/callback",
        `${origin}/declares-redirect`,
      ),
      false,
    );
    assert.equal(
      await validateRedirect(
        "https://redirect.example/callback",
        `${origin}/declares-nothing`,
      ),
      false,
    );
  });

  it("Invalidates declared `redirect_uri` with different path or scheme", async () => {
    assert.equal(
      await validateRedirect(
        "https://redirect.example/elsewhere",
        `${origin}/declares-redirect`,
      ),
      false,
    );
    assert.equal(
      await validateRedirect(
        // eslint-disable-next-line unicorn/prefer-https -- downgraded scheme is the condition under test
        "http://redirect.example/callback",
        `${origin}/declares-redirect`,
      ),
      false,
    );
  });

  it("Invalidates `redirect_uri` matching a declared pattern", async () => {
    // A declared `*.` prefix is matched literally, not as a wildcard: any
    // pattern support in redirect URLs opens up attack vectors
    for (const redirectUri of [
      "https://abc123.extension.example/",
      "https://extension.example/",
      "https://a.b.extension.example/",
    ]) {
      assert.equal(
        await validateRedirect(redirectUri, `${origin}/declares-wildcard`),
        false,
      );
    }
  });

  it("Invalidates `redirect_uri` if `client_id` can’t be fetched", async () => {
    assert.equal(
      await validateRedirect(
        "https://redirect.example/callback",
        `${origin}/404`,
      ),
      false,
    );
  });

  it("Invalidates invalid URLs", async () => {
    assert.equal(
      await validateRedirect("foo", "https://client.example"),
      false,
    );
    assert.equal(
      await validateRedirect("https://client.example", "bar"),
      false,
    );
  });
});
