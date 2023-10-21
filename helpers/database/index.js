import { MongoMemoryServer } from "mongodb-memory-server";
import { getMongodbConfig } from "@indiekit/indiekit/lib/mongodb.js";

/**
 * Generate access token for testing
 * @param {object} name - Database name
 * @returns {Promise<object>} MongoDB database
 */
export const testDatabase = async (name) => {
  const mongod = await MongoMemoryServer.create();
  const mongodbUrl = mongod.getUri();
  const database = await getMongodbConfig(mongodbUrl);

  return database.collection(name);
};
