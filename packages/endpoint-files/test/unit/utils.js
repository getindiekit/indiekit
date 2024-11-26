import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { getFileName, getFileUrl } from "../../lib/utils.js";

describe("endpoint-files/lib/utils", () => {
  it("Gets file name from a URL", () => {
    assert.equal(getFileName("http://foo.bar/baz.jpg"), "baz.jpg");
    assert.equal(getFileName("http://foo.bar/bar/qux.mp3"), "qux.mp3");
  });

  it("Gets file URL", () => {
    assert.equal(
      getFileUrl("aHR0cHM6Ly93ZWJzaXRlLmV4YW1wbGUvZm9vYmFy"),
      "https://website.example/foobar",
    );
  });
});
