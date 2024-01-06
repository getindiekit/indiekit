import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { summaryRows } from "../../../lib/globals/index.js";

describe("frontend/lib/globals/summary-row", () => {
  it("Transforms object to array for consumption by summary component", () => {
    const result = summaryRows({
      array: ["foo", "bar"],
      boolean: [true],
      object: {
        foo: "bar",
      },
      string: "string",
    });

    assert.equal(result[0].key.text, "array");
    assert.match(result[0].value.text, /^<pre class="language-js">/);
    assert.match(result[1].value.text, /^<code class="token boolean">/);
    assert.match(result[2].value.text, /^<pre class="language-js">/);
    assert.match(result[3].value.text, /^<code class="token string">/);
  });
});
