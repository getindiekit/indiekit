import mongodb from "mongodb";

/**
 * Connect to MongoDB database
 * @param {*} mongodbUrl - MongoDB URL
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
      console.warn(error.message);
      return false;
    }
  }
};
