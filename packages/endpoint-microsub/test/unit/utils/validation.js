import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  validateAction,
  validateChannel,
  validateEntries,
  validateChannelName,
  parseArrayParameter,
} from "../../../lib/utils/validation.js";

describe("endpoint-microsub/lib/utils/validation", () => {
  describe("validateAction", () => {
    it("Accepts valid actions", () => {
      assert.doesNotThrow(() => validateAction("channels"));
      assert.doesNotThrow(() => validateAction("timeline"));
    });

    it("Rejects missing action", () => {
      assert.throws(() => validateAction(), {
        message: /Missing required parameter: action/,
      });
      // eslint-disable-next-line unicorn/no-null -- Testing null input handling
      assert.throws(() => validateAction(null), {
        message: /Missing required parameter: action/,
      });
    });

    it("Rejects invalid action", () => {
      assert.throws(() => validateAction("invalid"), {
        message: /Invalid action/,
      });
    });
  });

  describe("validateChannel", () => {
    it("Accepts valid channel", () => {
      assert.doesNotThrow(() => validateChannel("test-channel"));
    });

    it("Rejects missing channel when required", () => {
      assert.throws(() => validateChannel(), {
        message: /Missing required parameter: channel/,
      });
    });

    it("Allows missing channel when not required", () => {
      assert.doesNotThrow(() => validateChannel(undefined, false));
    });
  });

  describe("validateEntries", () => {
    it("Returns array for single entry", () => {
      const result = validateEntries("entry-1");
      assert.deepEqual(result, ["entry-1"]);
    });

    it("Returns array for array of entries", () => {
      const result = validateEntries(["entry-1", "entry-2"]);
      assert.deepEqual(result, ["entry-1", "entry-2"]);
    });

    it("Rejects missing entries", () => {
      assert.throws(() => validateEntries(), {
        message: /Missing required parameter: entry/,
      });
    });
  });

  describe("validateChannelName", () => {
    it("Accepts valid name", () => {
      assert.doesNotThrow(() => validateChannelName("My Channel"));
    });

    it("Rejects empty name", () => {
      assert.throws(() => validateChannelName(""), {
        message: /Missing required parameter: name/,
      });
    });

    it("Rejects name over 100 characters", () => {
      const longName = "a".repeat(101);
      assert.throws(() => validateChannelName(longName), {
        message: /100 characters or less/,
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
