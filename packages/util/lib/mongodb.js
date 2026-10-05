/* eslint-disable unicorn/no-array-method-this-argument */
import makeDebug from "debug";
import { ObjectId, MongoClient } from "mongodb";

const debug = makeDebug(`indiekit:util:mongodb`);

/**
 * Get an object ID to bound a query with, if the value can provide one
 *
 * Cursor values reach us from a query string, so they can be anything a reader
 * typed, an array of repeated parameters, or a link that was valid before the
 * item it pointed at was deleted. `getObjectId` throws on all of those, which
 * would otherwise surface as a 500 for what is only an unusable bookmark.
 * @param {string|string[]|ObjectId} value - Cursor value
 * @returns {ObjectId|undefined} Object ID, if the value yields one
 */
const getBoundary = (value) => {
  try {
    if (Array.isArray(value)) {
      // A query parameter given more than once arrives as an array
      throw new TypeError(`Cursor is not a single value`);
    }

    return getObjectId(value);
  } catch {
    debug(`Ignored unusable pagination cursor: %O`, value);
  }
};

/**
 * Get pagination cursor
 *
 * Items are listed newest first. Paging forwards (`after`) takes the items
 * below that one, paging backwards (`before`) the items above it. An `after`
 * or `before` that doesn’t name an item is ignored, giving the first page.
 * @param {object} collection - Database collection
 * @param {string|string[]|ObjectId} [after] - Items created after object with this ID
 * @param {string|string[]|ObjectId} [before] - Items created before object with this ID
 * @param {number} [limit] - Number of items to return within cursor
 * @returns {Promise<object>} Pagination cursor
 */
export const getCursor = async (collection, after, before, limit) => {
  const cursor = {
    items: [],
    hasNext: false,
    hasPrev: false,
  };

  // `before` wins when both are given
  const boundaryValue = before || after;
  const boundary = boundaryValue ? getBoundary(boundaryValue) : undefined;
  const isPagingBackwards = Boolean(before) && Boolean(boundary);

  const query = {};
  if (boundary) {
    query._id = isPagingBackwards ? { $gt: boundary } : { $lt: boundary };
  }

  const options = {
    limit: limit ? Math.trunc(limit) : 40,
    // Paging backwards wants the items *adjacent* to the boundary, which are
    // the smallest IDs above it. Taking them in the listing’s own descending
    // order would instead take the largest — the newest items in the
    // collection — so that going back from page three landed on page one.
    sort: { _id: isPagingBackwards ? 1 : -1 },
  };

  const items = await collection.find(query, options).toArray();

  if (isPagingBackwards) {
    // Restore the order the items are listed in
    items.reverse();
  }

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
 * Connect to MongoDB client
 * @param {string} mongodbUrl - MongoDB URL
 * @returns {Promise<object>} MongoDB client
 */
export const getMongodbClient = async (mongodbUrl) => {
  if (!mongodbUrl) {
    return;
  }

  let client;

  const connectTimeoutMS = 5000;
  try {
    debug(`Try creating MongoDB client`);
    client = new MongoClient(mongodbUrl, {
      connectTimeoutMS,
    });
  } catch (error_) {
    const error =
      error_ instanceof Error
        ? error_
        : new Error(String(error_), { cause: error_ });

    debug(
      `Could not create MongoDB client with %dms: %O`,
      connectTimeoutMS,
      error,
    );
    console.error(`Could not create MongoDB client: ${error.message}`);

    return { error };
  }

  try {
    debug(`Try connecting to MongoDB client`);
    await client.connect();
  } catch (error_) {
    const error =
      error_ instanceof Error
        ? error_
        : new Error(String(error_), { cause: error_ });

    debug(`Could not connect to MongoDB client: %O`, error);
    console.error(`Could not connect to MongoDB: ${error.message}`);

    await client.close();
    return { error };
  }

  return { client };
};

/**
 * Get object ID
 * @param {string|ObjectId} uid - Item UID
 * @returns {ObjectId} Object ID
 */
export const getObjectId = (uid) => {
  return new ObjectId(uid);
};
