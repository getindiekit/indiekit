import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  validateAction,
  validateChannel,
  validateEntries,
  validateChannelName,
  parseArrayParameter,
} from "../../../lib/utils/validation.js";

/**
 * Stand-in for the localiser: the key and its values, space-separated
 * @param {string} key - Locale key
 * @param {...string} values - Values
 * @returns {string} Message
 */
const __ = (key, ...values) => [key, ...values].join(" ");

describe("endpoint-microsub/lib/utils/validation", () => {
  describe("validateAction", () => {
    it("Accepts valid actions", () => {
      assert.doesNotThrow(() => validateAction(__, "channels"));
      assert.doesNotThrow(() => validateAction(__, "timeline"));
    });

    it("Rejects missing action", () => {
      assert.throws(() => validateAction(__), {
        message: /missingParameter action/,
      });
      // eslint-disable-next-line unicorn/no-null -- Testing null input handling
      assert.throws(() => validateAction(__, null), {
        message: /missingParameter action/,
      });
    });

    it("Rejects invalid action", () => {
      assert.throws(() => validateAction(__, "invalid"), {
        message: /invalidValue action/,
      });
    });
  });

  describe("validateChannel", () => {
    it("Accepts valid channel", () => {
      assert.doesNotThrow(() => validateChannel(__, "test-channel"));
    });

    it("Rejects missing channel when required", () => {
      assert.throws(() => validateChannel(__), {
        message: /missingParameter channel/,
      });
    });

    it("Allows missing channel when not required", () => {
      assert.doesNotThrow(() => validateChannel(__, undefined, false));
    });
  });

  describe("validateEntries", () => {
    it("Returns array for single entry", () => {
      const result = validateEntries(__, "entry-1");
      assert.deepEqual(result, ["entry-1"]);
    });

    it("Returns array for array of entries", () => {
      const result = validateEntries(__, ["entry-1", "entry-2"]);
      assert.deepEqual(result, ["entry-1", "entry-2"]);
    });

    it("Rejects missing entries", () => {
      assert.throws(() => validateEntries(__), {
        message: /missingParameter entry/,
      });
    });
  });

  describe("validateChannelName", () => {
    it("Accepts valid name", () => {
      assert.doesNotThrow(() => validateChannelName(__, "My Channel"));
    });

    it("Rejects empty name", () => {
      assert.throws(() => validateChannelName(__, ""), {
        message: /missingParameter name/,
      });
    });

    it("Rejects name over 100 characters", () => {
      const longName = "a".repeat(101);
      assert.throws(() => validateChannelName(__, longName), {
        message: /nameTooLong 100/,
      });
    });
  });

  describe("parseArrayParameter", () => {
    it("Handles direct array", () => {
      const result = parseArrayParameter({ items: ["a", "b"] }, "items");
      assert.deepEqual(result, ["a", "b"]);
    });

    it("Handles single value", () => {
      const result = parseArrayParameter({ item: "single" }, "item");
      assert.deepEqual(result, ["single"]);
    });

    it("Handles indexed values", () => {
      const body = { "item[0]": "first", "item[1]": "second" };
      const result = parseArrayParameter(body, "item");
      assert.deepEqual(result, ["first", "second"]);
    });

    it("Returns empty array for missing parameter", () => {
      const result = parseArrayParameter({}, "missing");
      assert.deepEqual(result, []);
    });
  });
});
