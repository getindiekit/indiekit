import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { checkSchema, validationResult } from "express-validator";
import { mockRequest } from "mock-req-res";

import { hasValue, isRequired } from "../../lib/validation-schema.js";

/**
 * Validate a request body, requiring `featured.alt` if there is a `featured.url`
 * @param {object} body - Request body
 * @returns {Promise<string[]>} Paths of fields that failed validation
 */
const validateFeatured = async (body) => {
  const request = mockRequest({ body });
  await Promise.all(
    checkSchema({
      "featured.alt": {
        exists: { if: hasValue("featured.url") },
        notEmpty: true,
      },
    }).map((chain) => chain.run(request)),
  );

  return Object.keys(validationResult(request).mapped());
};

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

  it("Validates a field if another field has a value", async () => {
    const errors = await validateFeatured({ featured: { url: "/image.jpg" } });

    assert.deepEqual(errors, ["featured.alt"]);
  });

  it("Doesn’t validate a field if another field has no value", async () => {
    assert.deepEqual(await validateFeatured({ featured: { url: "" } }), []);
    assert.deepEqual(await validateFeatured({ featured: {} }), []);
    assert.deepEqual(await validateFeatured({}), []);
  });

  it("Doesn’t report a field that has a value", async () => {
    const errors = await validateFeatured({
      featured: { url: "/image.jpg", alt: "An image" },
    });

    assert.deepEqual(errors, []);
  });
});
