import Debug from "debug";
import mongodb from "mongodb";

const debug = new Debug("indiekit:mongodb");

/**
 * Connect to MongoDB database
 *
 * @param {*} mongodbUrl MongoDB URL
 * @returns {Promise|object} MongoDB database instance
 */
export const getMongodbConfig = async (mongodbUrl) => {
  if (mongodbUrl) {
    try {
      const { MongoClient } = mongodb;
      const client = new MongoClient(mongodbUrl, {
        connectTimeoutMS: 5000,
        useUnifiedTopology: true,
      });
      await client.connect();
      const database = client.db("indiekit");
      return database;
    } catch (error) {
      debug(error);
      return false;
    }
  }
};
