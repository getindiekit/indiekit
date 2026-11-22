import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { _withoutUndefined, getIndiekitConfig } from "../../lib/config.js";

describe("indiekit/lib/config", () => {
  it("Removes undefined values from configuration", () => {
    class Store {
      value = undefined;
    }
    const store = new Store();
    const result = _withoutUndefined({
      application: { name: "Test", themeColor: undefined },
      publication: { me: undefined, store },
      plugins: ["@indiekit/endpoint-auth", undefined],
    });

    assert.deepEqual(result, {
      application: { name: "Test" },
      publication: { store },
      plugins: ["@indiekit/endpoint-auth", undefined],
    });
    assert.equal(result.publication.store, store);
  });

  it("Uses default value if configured value is undefined", async () => {
    const result = await getIndiekitConfig({
      config: { application: { themeColor: undefined } },
    });

    assert.equal(result.application.themeColor, "#04f");
  });
});
