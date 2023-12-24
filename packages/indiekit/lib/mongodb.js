import { MongoClient } from "mongodb";

/**
 * Connect to MongoDB database
 * @param {string} mongodbUrl - MongoDB URL
 * @returns {Promise<import('mongodb').Db>} MongoDB database instance
 */
export const getMongodbConfig = async (mongodbUrl) => {
  if (mongodbUrl) {
    try {
      const client = new MongoClient(mongodbUrl, {
        connectTimeoutMS: 5000,
      });
      await client.connect();
      const database = client.db("indiekit");
      return database;
    } catch (error) {
      console.warn(error.message);
      return false;
    }
  }
};
