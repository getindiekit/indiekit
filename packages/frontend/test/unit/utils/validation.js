import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { tagInputSanitizer } from "../../../lib/utils/validation.js";

describe("frontend/lib/sanitizer", () => {
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
