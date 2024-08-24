import makeDebug from "debug";
import { MongoClient } from "mongodb";

const debug = makeDebug(`indiekit:mongodb`);

/**
 * Connect to MongoDB client
 * @param {string} mongodbUrl - MongoDB URL
 * @returns {Promise<object>} MongoDB client
 */
export const getMongodbClient = async (mongodbUrl) => {
  let client;

  if (!mongodbUrl) {
    return;
  }

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
