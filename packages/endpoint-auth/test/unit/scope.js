import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockResponse } from "mock-req-res";

import { getScopeItems } from "../../lib/scope.js";

describe("endpoint-auth/lib/scope", () => {
  it("Gets `items` object for checkboxes component (string scope)", () => {
    const response = mockResponse({
      locals: { __: (value) => value },
    });
    const result = getScopeItems("create update", response);

    assert.equal(result.length, 2);
    assert.equal(result[0].checked, true);
    assert.equal(result[0].value, "create");
  });

  it("Gets `items` object for checkboxes component (Array scope)", () => {
    const response = mockResponse({
      locals: { __: (value) => value },
    });
    const result = getScopeItems(["create", "update"], response);

    assert.equal(result.length, 2);
    assert.equal(result[0].checked, true);
    assert.equal(result[0].value, "create");
  });
});
