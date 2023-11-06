import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { getCanonicalUrl, isSameOrigin } from "../../lib/url.js";

describe("util/lib/url", () => {
  it("Gets canonical URL", () => {
    assert.equal(
      getCanonicalUrl("https://website.example"),
      "https://website.example/",
    );
    assert.equal(
      getCanonicalUrl("path1", "https://website.example"),
      "https://website.example/path1",
    );
    assert.equal(
      getCanonicalUrl("/path2", "https://website.example"),
      "https://website.example/path2",
    );
    assert.equal(
      getCanonicalUrl(
        "https://website.example/path3",
        "https://website.example",
      ),
      "https://website.example/path3",
    );
    assert.equal(getCanonicalUrl("path5", "path4"), "path4/path5");
  });

  it("Checks if parsed URL string has given origin", () => {
    assert.equal(
      isSameOrigin(
        "https://mastodon.example/@username/1234567890987654321",
        "https://mastodon.example",
      ),
      true,
    );
    assert.equal(
      isSameOrigin("https://getindiekit.com", "https://mastodon.example"),
      false,
    );
  });
});
