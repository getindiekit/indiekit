import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  parseLimit,
} from "../../../lib/utils/pagination.js";

describe("endpoint-microsub/lib/utils/pagination", () => {
  describe("parseLimit", () => {
    it("Returns parsed number for valid string", () => {
      assert.equal(parseLimit("25"), 25);
    });

    it("Returns DEFAULT_LIMIT for invalid string", () => {
      assert.equal(parseLimit("abc"), DEFAULT_LIMIT);
    });

    it("Returns DEFAULT_LIMIT for negative number", () => {
      assert.equal(parseLimit("-5"), DEFAULT_LIMIT);
    });

    it("Returns DEFAULT_LIMIT for zero", () => {
      assert.equal(parseLimit("0"), DEFAULT_LIMIT);
    });

    it("Clamps to MAX_LIMIT for large values", () => {
      assert.equal(parseLimit("500"), MAX_LIMIT);
    });

    it("Returns DEFAULT_LIMIT for undefined", () => {
      assert.equal(parseLimit(), DEFAULT_LIMIT);
    });

    it("Handles number input", () => {
      assert.equal(parseLimit(30), 30);
    });
  });

  describe("Constants", () => {
    it("DEFAULT_LIMIT is 20", () => {
      assert.equal(DEFAULT_LIMIT, 20);
    });

    it("MAX_LIMIT is 100", () => {
      assert.equal(MAX_LIMIT, 100);
    });
  });
});
