import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { isArray } from "../../../lib/filters/index.js";

describe("frontend/lib/filters/array", () => {
  it("Excerpts a string", () => {
    assert.equal(isArray(["foo", "bar"]), true);
    assert.equal(isArray("foo bar"), false);
  });
});
