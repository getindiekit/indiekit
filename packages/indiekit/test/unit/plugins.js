import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { getInstalledPlugin, getPluginId } from "../../lib/plugins.js";

describe("indiekit/lib/plugins", async () => {
  it("Gets installed plug-in", () => {
    // Partial plug-ins, with only the value a lookup needs
    const installedPlugins = /** @type {Set<IndiekitPlugin>} */ (
      /** @type {unknown} */ (
        new Set([
          {
            id: "@scope-package-name",
          },
        ])
      )
    );

    assert.deepEqual(
      getInstalledPlugin(installedPlugins, "@scope/package-name"),
      {
        id: "@scope-package-name",
      },
    );
  });

  it("Gets normalised plug-in ID", () => {
    assert.equal(getPluginId("@scope/package-name"), "@scope-package-name");
  });
});
