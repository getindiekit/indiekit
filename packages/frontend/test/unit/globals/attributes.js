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

  it("Skips an attribute without a value, not those after it", () => {
    const result = attributes({
      editor: true,
      "editor-locale": undefined,
      "editor-status": "false",
      "editor-toolbar": "false",
    });

    assert.equal(
      result,
      ' editor editor-status="false" editor-toolbar="false"',
    );
  });
});
