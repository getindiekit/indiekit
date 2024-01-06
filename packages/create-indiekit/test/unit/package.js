import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";
import { getPackageValues } from "../../lib/package.js";

describe("create-indiekit/lib/package", () => {
  it("Gets package values", async () => {
    mock.method(console, "info", () => {});

    const result = await getPackageValues({
      me: "https://website.example",
      presetPlugin: "@indiekit/preset-jekyll",
      storePlugin: "@indiekit-test/store",
      syndicationPlugins: [],
    });

    assert.deepEqual(result, {
      config: {
        plugins: ["@indiekit/preset-jekyll", "@indiekit-test/store"],
        publication: {
          me: "https://website.example",
        },
      },
      dependencies: [
        "@indiekit/indiekit",
        "@indiekit/preset-jekyll",
        "@indiekit-test/store",
      ],
    });
  });
});
