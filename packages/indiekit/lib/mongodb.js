import mongodb from 'mongodb';

export const getMongodbConfig = async mongodbUrl => {
  if (mongodbUrl) {
    try {
      const {MongoClient} = mongodb;
      const client = new MongoClient(mongodbUrl, {
        connectTimeoutMS: 5000,
        useUnifiedTopology: true,
      });
      await client.connect();
      const database = client.db('indiekit');
      return database;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
};
