/**
 * Cursor-based pagination utilities for Microsub
 * @module utils/pagination
 */

import { ObjectId } from "mongodb";

/**
 * Default pagination limit
 */
export const DEFAULT_LIMIT = 20;

/**
 * Maximum pagination limit
 */
export const MAX_LIMIT = 100;

/**
 * Encode a cursor from timestamp and ID
 * @param {Date} timestamp - Item timestamp
 * @param {string} id - Item ID
 * @returns {string} Base64-encoded cursor
 */
export function encodeCursor(timestamp, id) {
  const data = {
    t: timestamp instanceof Date ? timestamp.toISOString() : timestamp,
    i: id.toString(),
  };
  return Buffer.from(JSON.stringify(data)).toString("base64url");
}

/**
 * Decode a cursor string
 * @param {string} cursor - Base64-encoded cursor
 * @returns {object|undefined} Decoded cursor with timestamp and id
 */
export function decodeCursor(cursor) {
  if (!cursor) return;

  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf8");
    const data = JSON.parse(decoded);
    return {
      timestamp: new Date(data.t),
      id: data.i,
    };
  } catch {
    return;
  }
}

/**
 * Build MongoDB query for cursor-based pagination
 * @param {object} options - Pagination options
 * @param {string} [options.before] - Before cursor
 * @param {string} [options.after] - After cursor
 * @param {object} [options.baseQuery] - Base query to extend
 * @returns {object} MongoDB query object
 */
export function buildPaginationQuery({ before, after, baseQuery = {} }) {
  const query = { ...baseQuery };

  if (before) {
    const cursor = decodeCursor(before);
    if (cursor) {
      // Items newer than cursor (for scrolling up)
      query.$or = [
        { published: { $gt: cursor.timestamp } },
        {
          published: cursor.timestamp,
          _id: { $gt: new ObjectId(cursor.id) },
        },
      ];
    }
  } else if (after) {
    const cursor = decodeCursor(after);
    if (cursor) {
      // Items older than cursor (for scrolling down)
      query.$or = [
        { published: { $lt: cursor.timestamp } },
        {
          published: cursor.timestamp,
          _id: { $lt: new ObjectId(cursor.id) },
        },
      ];
    }
  }

  return query;
}

/**
 * Build sort options for cursor pagination
 * @param {string} [before] - Before cursor (ascending order)
 * @returns {object} MongoDB sort object
 */
export function buildPaginationSort(before) {
  if (before) {
    return { published: 1, _id: 1 };
  }
  return { published: -1, _id: -1 };
}

/**
 * Generate pagination cursors from items
 * @param {Array} items - Array of items
 * @param {number} limit - Items per page
 * @param {boolean} hasMore - Whether more items exist
 * @param {string} [before] - Original before cursor
 * @returns {object} Pagination object with before/after cursors
 */
export function generatePagingCursors(items, limit, hasMore, before) {
  if (!items || items.length === 0) {
    return {};
  }

  const paging = {};

  if (before) {
    items.reverse();
    paging.after = encodeCursor(items.at(-1).published, items.at(-1)._id);
    if (hasMore) {
      paging.before = encodeCursor(items[0].published, items[0]._id);
    }
  } else {
    if (hasMore) {
      paging.after = encodeCursor(items.at(-1).published, items.at(-1)._id);
    }
    if (items.length > 0) {
      paging.before = encodeCursor(items[0].published, items[0]._id);
    }
  }

  return paging;
}

/**
 * Parse and validate limit parameter
 * @param {string|number} limit - Requested limit
 * @returns {number} Validated limit
 */
export function parseLimit(limit) {
  const parsed = Number.parseInt(limit, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return DEFAULT_LIMIT;
  }
  return Math.min(parsed, MAX_LIMIT);
}
