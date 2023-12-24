import { MongoMemoryServer } from "mongodb-memory-server";
import { getMongodbClient } from "@indiekit/indiekit/lib/mongodb.js";

/**
 * Generate access token for testing
 * @param {object} name - Database name
 * @returns {Promise<object>} MongoDB database
 */
export const testDatabase = async (name) => {
  const mongod = await MongoMemoryServer.create();
  const mongodbUrl = mongod.getUri();
  const client = await getMongodbClient(mongodbUrl);
  const database = client.db("indiekit-test");

  return database.collection(name);
};
