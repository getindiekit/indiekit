import { MongoClient } from "mongodb";

/**
 * Connect to MongoDB client
 * @param {string} mongodbUrl - MongoDB URL
 * @returns {Promise<import('mongodb').MongoClient>} MongoDB client
 */
export const getMongodbClient = async (mongodbUrl) => {
  if (mongodbUrl) {
    try {
      const client = new MongoClient(mongodbUrl, {
        connectTimeoutMS: 5000,
      });
      await client.connect();

      return client;
    } catch (error) {
      console.warn(error.message);
    }
  }
};
