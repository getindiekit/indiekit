import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { ObjectId } from "mongodb";

import {
  buildPaginationQuery,
  buildPaginationSort,
  decodeCursor,
  DEFAULT_LIMIT,
  encodeCursor,
  generatePagingCursors,
  MAX_LIMIT,
  parseLimit,
} from "../../../lib/utils/pagination.js";

/**
 * Create mock items for testing
 * @param {number} count - Number of items
 * @returns {Array} Mock items
 */
function createMockItems(count) {
  return Array.from({ length: count }, (_, index) => ({
    _id: new ObjectId(),
    published: new Date(Date.now() - index * 1000),
  }));
}

describe("endpoint-microsub/lib/utils/pagination", () => {
  describe("encodeCursor", () => {
    it("Encodes timestamp and ID to base64url", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const id = "507f1f77bcf86cd799439011";
      const cursor = encodeCursor(date, id);

      assert.ok(typeof cursor === "string");
      assert.ok(cursor.length > 0);
      // Should be valid base64url (no +, /, or =)
      assert.ok(!/[+/=]/.test(cursor));
    });

    it("Handles string timestamp", () => {
      const cursor = encodeCursor("2024-01-15T10:30:00Z", "abc123");
      assert.ok(typeof cursor === "string");
    });
  });

  describe("decodeCursor", () => {
    it("Decodes valid cursor", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const id = "507f1f77bcf86cd799439011";
      const cursor = encodeCursor(date, id);
      const decoded = decodeCursor(cursor);

      assert.ok(decoded);
      assert.equal(decoded.timestamp.toISOString(), date.toISOString());
      assert.equal(decoded.id, id);
    });

    it("Returns undefined for null cursor", () => {
      // eslint-disable-next-line unicorn/no-null -- Testing null input handling
      const decoded = decodeCursor(null);
      assert.equal(decoded, undefined);
    });

    it("Returns undefined for undefined cursor", () => {
      const decoded = decodeCursor();
      assert.equal(decoded, undefined);
    });

    it("Returns undefined for empty string", () => {
      const decoded = decodeCursor("");
      assert.equal(decoded, undefined);
    });

    it("Returns undefined for invalid base64", () => {
      const decoded = decodeCursor("not-valid-base64!!!");
      assert.equal(decoded, undefined);
    });

    it("Returns undefined for valid base64 but invalid JSON", () => {
      const invalidJson = Buffer.from("not json").toString("base64url");
      const decoded = decodeCursor(invalidJson);
      assert.equal(decoded, undefined);
    });
  });

  describe("buildPaginationQuery", () => {
    it("Returns base query when no cursors", () => {
      const baseQuery = { userId: "user1" };
      const query = buildPaginationQuery({ baseQuery });
      assert.deepEqual(query, baseQuery);
    });

    it("Adds $or clause for before cursor", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const id = "507f1f77bcf86cd799439011";
      const cursor = encodeCursor(date, id);

      const query = buildPaginationQuery({ before: cursor });

      assert.ok(query.$or);
      assert.equal(query.$or.length, 2);
      // First condition: published > cursor.timestamp
      assert.ok(query.$or[0].published.$gt);
      // Second condition: same timestamp but greater ID
      assert.ok(query.$or[1].published);
      assert.ok(query.$or[1]._id.$gt);
    });

    it("Adds $or clause for after cursor", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const id = "507f1f77bcf86cd799439011";
      const cursor = encodeCursor(date, id);

      const query = buildPaginationQuery({ after: cursor });

      assert.ok(query.$or);
      assert.equal(query.$or.length, 2);
      // First condition: published < cursor.timestamp
      assert.ok(query.$or[0].published.$lt);
    });

    it("Merges with base query", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const id = "507f1f77bcf86cd799439011";
      const cursor = encodeCursor(date, id);
      const baseQuery = { channelId: "ch1" };

      const query = buildPaginationQuery({ after: cursor, baseQuery });

      assert.equal(query.channelId, "ch1");
      assert.ok(query.$or);
    });

    it("Ignores invalid before cursor", () => {
      const query = buildPaginationQuery({ before: "invalid" });
      assert.ok(!query.$or);
    });
  });

  describe("buildPaginationSort", () => {
    it("Returns descending sort by default", () => {
      const sort = buildPaginationSort();
      assert.deepEqual(sort, { published: -1, _id: -1 });
    });

    it("Returns ascending sort when before cursor present", () => {
      const sort = buildPaginationSort("some-cursor");
      assert.deepEqual(sort, { published: 1, _id: 1 });
    });
  });

  describe("generatePagingCursors", () => {
    it("Returns empty object for empty items", () => {
      const cursors = generatePagingCursors([], 20, false);
      assert.deepEqual(cursors, {});
    });

    it("Returns empty object for null items", () => {
      // eslint-disable-next-line unicorn/no-null -- Testing null input handling
      const cursors = generatePagingCursors(null, 20, false);
      assert.deepEqual(cursors, {});
    });

    it("Returns after cursor when hasMore is true", () => {
      const items = createMockItems(5);
      const cursors = generatePagingCursors(items, 5, true);

      assert.ok(cursors.after);
      assert.ok(cursors.before);
    });

    it("Returns only before cursor when hasMore is false", () => {
      const items = createMockItems(5);
      const cursors = generatePagingCursors(items, 10, false);

      assert.ok(cursors.before);
      assert.ok(!cursors.after);
    });

    it("Reverses items and sets cursors when using before", () => {
      const items = createMockItems(5);
      const originalFirstId = items[0]._id.toString();

      const cursors = generatePagingCursors(items, 5, true, "some-before");

      // Items should be reversed
      assert.equal(items.at(-1)._id.toString(), originalFirstId);
      // Should have after cursor (older items exist)
      assert.ok(cursors.after);
    });
  });

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
