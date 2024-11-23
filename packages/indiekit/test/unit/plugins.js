import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { getInstalledPlugin, getPluginId } from "../../lib/plugins.js";

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

  it("Gets normalised plug-in ID", () => {
    assert.equal(getPluginId("@scope/package-name"), "@scope-package-name");
  });
});
