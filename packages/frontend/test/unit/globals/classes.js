import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { classes } from "../../../lib/globals/index.js";

describe("frontend/lib/globals/classes", () => {
  it("Generates space-separated list of class names", () => {
    const result = classes("foo");
    const resultWithClasses = classes("foo", {
      classes: "bar baz",
    });
    const resultWithError = classes("foo", {
      errorMessage: "Enter a qux",
    });
    const resultWithErrorAndClasses = classes("foo", {
      classes: "bar baz",
      errorMessage: "Enter a qux",
    });

    assert.equal(result, "foo");
    assert.equal(resultWithClasses, "foo bar baz");
    assert.equal(resultWithError, "foo foo--error");
    assert.equal(resultWithErrorAndClasses, "foo foo--error bar baz");
  });
});
