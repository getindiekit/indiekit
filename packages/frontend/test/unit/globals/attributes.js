import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { attributes } from "../../../lib/globals/index.js";

describe("frontend/lib/globals/attributes", () => {
  it("Generates space-separated list of HTML attribute key values", () => {
    const result = attributes({
      id: "foo",
      "data-value": "bar",
      readonly: true,
      class: "",
    });

    assert.equal(result, ' id="foo" data-value="bar" readonly');
  });
});
