import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { fieldData } from "../../../lib/globals/index.js";

describe("frontend/lib/globals/field-data", () => {
  it("Gets field data", () => {
    const result = fieldData.call(
      {
        ctx: {
          properties: { foo: "foo" },
        },
      },
      "foo",
    );

    assert.equal(result.errorMessage, undefined);
    assert.equal(result.value, "foo");
  });

  it("Gets field data with errors", () => {
    const result = fieldData.call(
      {
        ctx: {
          properties: { foo: "foo" },
          errors: { foo: { value: "bar", msg: "Enter a foo" } },
        },
      },
      "foo",
    );

    assert.deepEqual(result.errorMessage, { text: "Enter a foo" });
    assert.equal(result.value, "bar");
  });
});
