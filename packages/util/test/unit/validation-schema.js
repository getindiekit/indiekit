import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockRequest } from "mock-req-res";

import { isRequired } from "../../lib/validation-schema.js";

describe("util/lib/validation-schema", () => {
  it("Check if field is required", () => {
    const request = mockRequest({
      app: {
        locals: {
          publication: {
            postTypes: {
              foobar: {
                type: "foobar",
                name: "Foobar",
                properties: ["foo", "bar"],
                "required-properties": ["foo"],
              },
            },
          },
        },
      },
      body: { postType: "foobar" },
    });

    assert.equal(isRequired(request, "foo"), true);
    assert.equal(isRequired(request, "bar"), false);
  });
});
