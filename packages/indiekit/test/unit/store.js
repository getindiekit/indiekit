import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { testConfig } from "@indiekit-test/config";

import { Indiekit } from "../../index.js";
import { getMediaStore, getStore } from "../../lib/store.js";

/**
 * Create an Indiekit instance, with given publication configuration
 * @param {IndiekitPublicationConfig} [publication] - Publication configuration
 * @returns {Promise<IndiekitInstance>} Indiekit instance
 */
const testIndiekit = async (publication) => {
  const config = await testConfig();
  config.publication = { ...config.publication, ...publication };

  return Indiekit.initialize({ config });
};

describe("indiekit/lib/store", async () => {
  const { default: IndiekitPlugin } = await import("@indiekit-test/store");
  const store = new IndiekitPlugin();
  // @ts-ignore
  store.id = "@indiekit-test-store";

  it("Gets store from application config", async () => {
    const indiekit = await testIndiekit();
    indiekit.addStore(store);
    const result = getStore(indiekit);

    assert.ok(result);
    assert.equal(result.info.name, "Test store");
  });

  it("Gets store from publication config", async () => {
    const indiekit = await testIndiekit({ store: "@indiekit-test/store" });
    indiekit.installedPlugins.add(store);
    const result = getStore(indiekit);

    assert.ok(result);
    assert.equal(result.info.name, "Test store");
  });

  it("Gets media store from publication config", async () => {
    const indiekit = await testIndiekit({ mediaStore: "@indiekit-test/store" });
    indiekit.installedPlugins.add(store);
    const result = getMediaStore(indiekit);

    assert.ok(result);
    assert.equal(result.info.name, "Test store");
  });

  it("Gets default content store if no media store configured", async () => {
    const indiekit = await testIndiekit();
    // Set after initialising, as merging configuration would copy the store
    indiekit.publication.store = store;
    const result = getMediaStore(indiekit);

    assert.ok(result);
    assert.equal(result.info.name, "Test store");
  });
});
