import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { getInstalledPlugin } from "../../lib/plugins.js";

describe("indiekit/lib/plugins", async () => {
  it("Gets installed plug-in", () => {
    const installedPlugins = new Set([
      {
        id: "@scope-package-name",
      },
    ]);

    assert.deepEqual(
      getInstalledPlugin(installedPlugins, "@scope/package-name"),
      {
        id: "@scope-package-name",
      },
    );
  });
});
