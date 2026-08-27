/* eslint-disable unicorn/no-array-method-this-argument */
import makeDebug from "debug";
import { ObjectId, MongoClient } from "mongodb";

const debug = makeDebug(`indiekit:util:mongodb`);

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
    limit: limit ? Math.trunc(limit) : 40,
    sort: { _id: -1 },
  };

  // The id arrives as a string from the query string, and only the collection
  // knows what its own ids are. MongoDB collections have no `castId`, so they
  // keep coercing to an ObjectId as before.
  const castId = collection.castId ?? getObjectId;

  if (before) {
    query._id = { $gt: castId(before) };
  } else if (after) {
    query._id = { $lt: castId(after) };
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
  } catch (error) {
    debug(
      `Could not create MongoDB client with ${connectTimeoutMS}ms: ${error.message}`,
    );
    console.error(error.message);
    return { error };
  }

  try {
    debug(`Try connecting to MongoDB client`);
    await client.connect();
  } catch (error) {
    debug(`Could not connect to MongoDB client: ${error.message}`);
    console.error(error.message);
    await client.close();
    return { error };
  }

  return { client };
};

/**
 * Get object ID
 * @param {string} uid - Item UID
 * @returns {ObjectId} Object ID
 */
export const getObjectId = (uid) => {
  return new ObjectId(uid);
};
