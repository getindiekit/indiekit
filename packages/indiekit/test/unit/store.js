import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { getMediaStore, getStore } from "../../lib/store.js";

describe("indiekit/lib/store", async () => {
  const { default: IndiekitPlugin } = await import("@indiekit-test/store");
  const store = new IndiekitPlugin();
  // @ts-ignore
  store.id = "@indiekit-test-store";

  it("Gets store from application config", () => {
    const Indiekit = { application: { stores: [store] } };
    const result = getStore(Indiekit);

    assert.equal(result.info.name, "Test store");
  });

  it("Gets store from publication config", () => {
    const Indiekit = {
      application: { installedPlugins: [store] },
      publication: { store: "@indiekit-test/store" },
    };
    const result = getStore(Indiekit);

    assert.equal(result.info.name, "Test store");
  });

  it("Gets media store from publication config", () => {
    const Indiekit = {
      application: { installedPlugins: [store] },
      publication: { mediaStore: "@indiekit-test/store" },
    };
    const result = getMediaStore(Indiekit);

    assert.equal(result.info.name, "Test store");
  });

  it("Returns false if no media store configured", () => {
    const Indiekit = { publication: { store } };
    const result = getMediaStore(Indiekit);

    assert.equal(result, false);
  });
});
