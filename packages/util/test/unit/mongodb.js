import { strict as assert } from "node:assert";
import { after, beforeEach, describe, it, mock } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { ObjectId } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

import { getCursor, getMongodbClient } from "../../lib/mongodb.js";

const mongod = await MongoMemoryServer.create();

describe("util/lib/mongodb", async () => {
  const { client, database, mongoServer } = await testDatabase();
  let items;

  beforeEach(async () => {
    items = database.collection("items");
    await items.insertMany([{ name: "foo" }, { name: "bar" }, { name: "baz" }]);
  });

  after(async () => {
    mongod.stop();
    await client.close();
    await mongoServer.stop();
  });

  it("Gets pagination cursor", async () => {
    const result = await getCursor(items, undefined, undefined, 3);
    // baz, bar, foo
    assert.equal(result.items.length, 3);
    assert.equal(ObjectId.isValid(result.firstItem), true);
    assert.equal(ObjectId.isValid(result.lastItem), true);
    assert.equal(result.hasNext, false);
    assert.equal(result.hasPrev, false);
  });

  it("Gets pagination cursor after ID", async () => {
    const after = await items.findOne({ name: "baz" });
    const result = await getCursor(items, after._id);
    // bar, foo
    assert.equal(result.items.length, 2);
    assert.equal(result.hasNext, false);
    assert.equal(result.hasPrev, true);
  });

  // `?after=` and `?before=` arrive as strings, never as ObjectId instances,
  // so the cursor has to coerce them itself.
  it("Gets pagination cursor after ID given as a string", async () => {
    const afterItem = await items.findOne({ name: "baz" });
    const result = await getCursor(items, String(afterItem._id));
    // bar, foo
    assert.equal(result.items.length, 2);
    assert.equal(result.hasPrev, true);
  });

  it("Gets pagination cursor after and before IDs", async () => {
    const after = await items.findOne({ name: "baz" });
    const before = await items.findOne({ name: "foo" });
    const result = await getCursor(items, after._id, before._id, 1);
    // baz
    assert.equal(result.items.length, 1);
    assert.equal(result.hasNext, true);
    assert.equal(result.hasPrev, false);
  });

  it("Connects to MongoDB database", async () => {
    const mongodbUrl = mongod.getUri();
    const result = await getMongodbClient(mongodbUrl);

    assert.equal(result.client.s.url, mongodbUrl);

    result.client.close();
  });

  it("Returns error if can’t create a MongoDB client", async () => {
    mock.method(console, "error", () => {});

    await getMongodbClient("https://foo.bar");
    const result = console.error.mock.calls[0].arguments[0];

    assert.equal(
      result,
      `Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"`,
    );
  });

  // Uses an in-memory server with authentication enabled rather than whatever
  // happens to be listening on port 27017. The suite must not depend on a
  // service it did not start: `docs/development.md` puts MongoDB on 27018, so
  // a correctly configured machine would otherwise fail here after a
  // 30-second server-selection timeout.
  it("Returns error if can’t connect to MongoDB client", async () => {
    const authServer = await MongoMemoryServer.create({
      auth: { enable: true },
    });
    mock.method(console, "error", () => {});

    try {
      const uri = authServer
        .getUri()
        .replace("mongodb://", "mongodb://foo:bar@");
      await getMongodbClient(uri);
      const result = console.error.mock.calls[0].arguments[0];

      assert.equal(result, `Authentication failed.`);
    } finally {
      await authServer.stop();
    }
  });
});
