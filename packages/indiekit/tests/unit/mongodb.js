import test from "ava";
import sinon from "sinon";
import { MongoMemoryServer } from "mongodb-memory-server";
import { getMongodbClient } from "../../lib/mongodb.js";

test.beforeEach(async (t) => {
  const mongod = await MongoMemoryServer.create();
  const mongodbUrl = mongod.getUri();

  t.context = {
    url: mongodbUrl,
  };
});

test("Connects to MongoDB database", async (t) => {
  const result = await getMongodbClient(t.context.url);

  t.is(result.s.namespace.db, "admin");
});

test("Returns false if can’t connect to a MongoDB database", async (t) => {
  sinon.stub(console, "warn");
  await getMongodbClient("https://foo.bar");

  t.true(
    console.warn.calledWith(
      'Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"',
    ),
  );
});
