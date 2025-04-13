import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { sanitise } from "../../lib/object.js";

describe("util/lib/object", () => {
  it("Does not sanitise primitive", async (t) => {
    await t.test("Boolean", () => {
      assert.equal(sanitise(true), true);
    });
    await t.test("Number", () => {
      assert.equal(sanitise(1), 1);
    });
    await t.test("String", () => {
      assert.equal(sanitise("foo"), "foo");
    });
  });

  it("Removes empty values from object", () => {
    const result = sanitise({
      foo: "bar",
      bar: "",
      baz: {},
      qux: [],
      quux: " ",
      corge: 0,
      grault: { foo: "", bar: " ", baz: undefined },
      garply: ["foo", "bar", " ", undefined, 0, false],
    });

    assert.deepEqual(result, {
      foo: "bar",
      corge: 0,
      garply: ["foo", "bar", 0, false],
    });
  });
});
