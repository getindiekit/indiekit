import test from "ava";
import sinon from "sinon";
import { MongoMemoryServer } from "mongodb-memory-server";
import { getMongodbConfig } from "../../lib/mongodb.js";

test.beforeEach(async (t) => {
  const mongod = await MongoMemoryServer.create();
  const mongodbUrl = mongod.getUri();

  t.context = {
    url: mongodbUrl,
  };
});

test("Connects to MongoDB database", async (t) => {
  const result = await getMongodbConfig(t.context.url);

  t.is(result.s.namespace.db, "indiekit");
});

test("Returns false if can’t connect to a MongoDB database", async (t) => {
  sinon.stub(console, "warn");
  const result = await getMongodbConfig("https://foo.bar");

  t.true(
    console.warn.calledWith(
      'Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"'
    )
  );
  t.false(result);
});
