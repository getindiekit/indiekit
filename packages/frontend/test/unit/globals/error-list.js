import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { errorList } from "../../../lib/globals/index.js";

describe("frontend/lib/globals/error-list", () => {
  it("Transforms errors provided by express-validator", () => {
    const result = errorList({
      me: {
        value: "foo",
        msg: "Enter a valid URL",
        path: "fooBar[0].url",
        location: "body",
      },
    });

    assert.equal(result[0].href, "#foo-bar-0-url");
    assert.equal(result[0].text, "Enter a valid URL");
  });
});
