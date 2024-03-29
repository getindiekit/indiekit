/* eslint-disable unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument */
import { ObjectId } from "mongodb";

/**
 * Get pagination cursor
 * @param {object} collection - Database collection
 * @param {string} [after] - Items created after object with this ID
 * @param {string} [before] - Items created before object with this ID
 * @param {number} [limit] - Number of items to return within cursor
 * @returns {Promise<object>} Pagination cursor
 */
export const getCursor = async (collection, after, before, limit) => {
  const cursor = {
    items: [],
    hasNext: false,
    hasPrev: false,
  };
  const query = {};
  const options = {
    limit: Number.parseInt(String(limit), 10) || 40,
    sort: { _id: -1 },
  };

  if (before) {
    query._id = { $gt: getObjectId(before) };
  } else if (after) {
    query._id = { $lt: getObjectId(after) };
  }

  const items = await collection.find(query, options).toArray();

  if (items.length > 0) {
    cursor.items = items;
    cursor.lastItem = items.at(-1)._id;
    cursor.firstItem = items[0]._id;
    cursor.hasNext = Boolean(
      await collection.findOne({
        _id: { $lt: cursor.lastItem },
      }),
    );
    cursor.hasPrev = Boolean(
      await collection.findOne({
        _id: { $gt: cursor.firstItem },
      }),
    );
  }

  return cursor;
};

/**
 * Get object ID
 * @param {string} uid - Item UID
 * @returns {ObjectId} Object ID
 */
export const getObjectId = (uid) => {
  return new ObjectId(uid);
};
