import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { tagInputSanitizer } from "../../../components/tag-input/sanitizer.js";

describe("frontend/components/tag-input/sanitizer", () => {
  it("Excerpts a string", () => {
    assert.deepEqual(tagInputSanitizer.customSanitizer("foo, bar, bar,"), [
      "foo",
      "bar",
    ]);
    assert.deepEqual(tagInputSanitizer.customSanitizer(`["foo","bar"]`), [
      "foo",
      "bar",
    ]);
  });
});
