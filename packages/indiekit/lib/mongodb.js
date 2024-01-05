import { MongoClient } from "mongodb";

/**
 * Connect to MongoDB client
 * @param {string} mongodbUrl - MongoDB URL
 * @returns {import('mongodb').MongoClient|undefined} MongoDB client
 */
export const getMongodbClient = (mongodbUrl) => {
  if (mongodbUrl) {
    try {
      const client = new MongoClient(mongodbUrl, {
        connectTimeoutMS: 5000,
      });

      return client;
    } catch (error) {
      console.warn(error.message);
    }
  }
};
