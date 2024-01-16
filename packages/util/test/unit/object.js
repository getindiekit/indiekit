import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { sanitise } from "../../lib/object.js";

describe("util/lib/object", () => {
  it("Removes empty values from object", () => {
    const result = sanitise({
      foo: "bar",
      bar: "",
      baz: {},
      qux: [],
      quux: " ",
      corge: 0,
    });

    assert.deepEqual(result, {
      foo: "bar",
      corge: 0,
    });
  });
});
