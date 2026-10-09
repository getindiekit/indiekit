/* eslint-disable unicorn/no-array-method-this-argument */
import makeDebug from "debug";
import { MongoClient } from "mongodb";

const debug = makeDebug(`indiekit:util:mongodb`);

/**
 * Get a uid to bound a query with, if the value can provide one
 *
 * Cursor values reach us from a query string, so a parameter given more than
 * once arrives as an array, which can't name an item. Anything else is passed
 * through: a uid is opaque, so there is nothing to validate it against short
 * of asking the database, and a cursor naming an item deleted since the link
 * was made should still page from where that item sat.
 * @param {string|string[]} value - Cursor value
 * @returns {string|undefined} Uid, if the value yields one
 */
const getBoundary = (value) => {
  if (Array.isArray(value)) {
    debug(`Ignored unusable pagination cursor: %O`, value);
    return;
  }

  return String(value);
};

/**
 * Get pagination cursor
 *
 * Items are ordered by `properties.uid`. A UUIDv7 leads with a 48-bit
 * millisecond timestamp, so comparing two of them as strings compares when
 * they were created — the ordering `_id` gave, now carried by a property of
 * the item itself rather than by the database. Cursor values are the same
 * identifiers a client already sees in `q=source` responses and in the posts
 * and files URLs, so paging and lookup speak the same language.
 *
 * Items are listed newest first. Paging forwards (`after`) takes the items
 * below that one, paging backwards (`before`) the items above it.
 * @param {object} collection - Database collection
 * @param {string|string[]} [after] - Items created after item with this uid
 * @param {string|string[]} [before] - Items created before item with this uid
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

  // An item with no uid has no place in this ordering, and a bounded query
  // never matches one. Leave it out of the unbounded first page too, rather
  // than listing an item that paging then loses.
  /**
   * @type {Record<string, object>}
   */
  const query = { "properties.uid": { $type: "string" } };
  if (boundary) {
    query["properties.uid"] = isPagingBackwards
      ? { $gt: boundary }
      : { $lt: boundary };
  }

  const options = {
    limit: limit ? Math.trunc(limit) : 40,
    // Paging backwards wants the items *adjacent* to the boundary, which are
    // the smallest uids above it. Taking them in the listing’s own descending
    // order would instead take the largest — the newest items in the
    // collection — so that going back from page three landed on page one.
    sort: { "properties.uid": isPagingBackwards ? 1 : -1 },
  };

  const items = await collection.find(query, options).toArray();

  if (isPagingBackwards) {
    // Restore the order the items are listed in
    items.reverse();
  }

  if (items.length > 0) {
    cursor.items = items;
    cursor.lastItem = items.at(-1).properties.uid;
    cursor.firstItem = items[0].properties.uid;
    cursor.hasNext = Boolean(
      await collection.findOne({
        "properties.uid": { $lt: cursor.lastItem },
      }),
    );
    cursor.hasPrev = Boolean(
      await collection.findOne({
        "properties.uid": { $gt: cursor.firstItem },
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
