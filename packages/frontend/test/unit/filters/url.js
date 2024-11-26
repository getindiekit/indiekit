import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { friendlyUrl, imageUrl } from "../../../lib/filters/index.js";

describe("frontend/lib/filters/url", () => {
  it("Gets friendly URL", () => {
    assert.equal(friendlyUrl("https://foo.example/bar"), "foo.example/bar");
    assert.equal(friendlyUrl("https://foo.example"), "foo.example");
    assert.equal(friendlyUrl("foo.example/bar"), "foo.example/bar");
  });

  it("Gets image URL", () => {
    const application = {
      imageEndpoint: "/image",
      url: "https://server.example",
    };
    const result = imageUrl("/path/to/image.jpg", application);

    assert.equal(
      result,
      "https://server.example/image/_/%2Fpath%2Fto%2Fimage.jpg",
    );
  });

  it("Gets transformed image URL", () => {
    const application = {
      imageEndpoint: "/image",
      url: "https://server.example",
    };
    const result = imageUrl("/path/to/image.jpg", application, {
      width: 100,
      height: 100,
      fit: "contain",
    });

    assert.equal(
      result,
      "https://server.example/image/s_100x100,fit_contain/%2Fpath%2Fto%2Fimage.jpg",
    );
  });
});
