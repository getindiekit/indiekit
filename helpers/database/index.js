import { getMongodbClient } from "@indiekit/util";
import { MongoMemoryServer } from "mongodb-memory-server";

export const testDatabase = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  const mongodbClientOrError = await getMongodbClient(mongoUri);

  if (!mongodbClientOrError?.client) {
    throw (
      mongodbClientOrError?.error ??
      new Error("Could not connect to test database")
    );
  }

  const { client } = mongodbClientOrError;
  const database = await mongodbClientOrError.client.db();

  return { client, database, mongoServer, mongoUri };
};
