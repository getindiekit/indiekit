import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { itemId } from "../../../lib/globals/item-id.js";

describe("frontend/lib/globals/item-id", () => {
  it("Gets item `id` for radio/checkbox", () => {
    const defined = itemId("test", "prefix", { first: true, index: 0 });
    const first = itemId(undefined, "prefix", { first: true, index: 0 });
    const other = itemId(undefined, "prefix", { first: false, index: 2 });

    assert.equal(defined, "test");
    assert.equal(first, "prefix");
    assert.equal(other, "prefix-2");
  });
});
