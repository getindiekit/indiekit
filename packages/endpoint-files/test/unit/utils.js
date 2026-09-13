import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockAgent } from "@indiekit-test/mock-agent";
import { testToken } from "@indiekit-test/token";

import { getFileName, getFileProperties, getFileUrl } from "../../lib/utils.js";

await mockAgent("endpoint-files");

describe("endpoint-files/lib/utils", () => {
  it("Gets file name from a URL", () => {
    assert.equal(getFileName("https://foo.bar/baz.jpg"), "baz.jpg");
    assert.equal(getFileName("https://foo.bar/bar/qux.mp3"), "qux.mp3");
  });

  it("Gets file URL", () => {
    assert.equal(
      getFileUrl("aHR0cHM6Ly93ZWJzaXRlLmV4YW1wbGUvZm9vYmFy"),
      "https://website.example/foobar",
    );
  });

  it("Fetches a file that isn’t on the media endpoint’s first page of results", async () => {
    const result = await getFileProperties(
      "target-uid",
      "https://media-endpoint.example",
      testToken(),
    );

    assert.equal(result.uid, "target-uid");
  });
});
