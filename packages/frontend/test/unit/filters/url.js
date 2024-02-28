import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { friendlyUrl, imageUrl } from "../../../lib/filters/index.js";

describe("frontend/lib/filters/url", () => {
  it("Gets friendly URL", () => {
    assert.equal(friendlyUrl("https://foo.example/bar"), "foo.example/bar");
    assert.equal(friendlyUrl("foo.example/bar"), "foo.example/bar");
  });

  it("Gets transformed image URL", () => {
    const application = {
      imageEndpoint: "/image",
      url: "https://server.example",
    };
    const result = imageUrl("/path/to/image.jpg", application);

    assert.equal(
      result,
      "https://server.example/image/path/to/image.jpg?w=240&h=240&c=true",
    );
  });
});
