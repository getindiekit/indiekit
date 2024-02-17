import { MongoClient } from "mongodb";

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

  // Create client
  try {
    client = new MongoClient(mongodbUrl, {
      connectTimeoutMS: 5000,
    });
  } catch (error) {
    console.error(error.message);

    return { error };
  }

  // Connect to client
  try {
    await client.connect();
  } catch (error) {
    console.error(error.message);

    await client.close();
    return { error };
  }

  return { client };
};
