import { strict as assert } from "node:assert";
import { after, beforeEach, describe, it, mock } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { MongoMemoryServer } from "mongodb-memory-server";

import { getCursor, getMongodbClient } from "../../lib/mongodb.js";

/**
 * @param {object} cursor - Pagination cursor
 * @returns {string[]} Names of the items it holds, in order
 */
const names = (cursor) => cursor.items.map((item) => item.properties.name);

/**
 * A uid for the item created at a given position, shaped like the UUIDv7 the
 * endpoints assign and sorting the same way: by when the item was created.
 * @param {number} index - Position in creation order
 * @returns {string} Uid
 */
const uidAt = (index) =>
  `0199c0f0-0000-7000-8000-${String(index).padStart(12, "0")}`;

const mongod = await MongoMemoryServer.create();

describe("util/lib/mongodb", async () => {
  const { client, database, mongoServer } = await testDatabase();

  after(async () => {
    await mongod.stop();
    await client.close();
    await mongoServer.stop();
  });

  describe("getCursor", () => {
    const items = database.collection("items");

    /**
     * Insert items named for the order they were created in, so that a page
     * can be asserted by name. `item-0` is the oldest, and so listed last.
     * @param {number} count - Number of items to insert
     * @returns {Promise<void>}
     */
    const seed = async (count) => {
      await items.insertMany(
        Array.from({ length: count }, (_, index) => ({
          properties: { name: `item-${index}`, uid: uidAt(index) },
        })),
      );
    };

    /**
     * @param {string} name - Item name
     * @returns {Promise<string>} That item’s uid
     */
    const uidOf = async (name) => {
      const item = await items.findOne({ "properties.name": name });
      return item.properties.uid;
    };

    beforeEach(async () => {
      // Every test seeds its own items, so start from nothing. Left to
      // accumulate, a test reads whatever the ones before it inserted.
      await items.deleteMany({});
    });

    it("Lists items newest first", async () => {
      await seed(5);

      const result = await getCursor(items, undefined, undefined, 3);

      assert.deepEqual(names(result), ["item-4", "item-3", "item-2"]);
      assert.equal(result.firstItem, await uidOf("item-4"));
      assert.equal(result.lastItem, await uidOf("item-2"));
      assert.equal(result.hasNext, true);
      assert.equal(result.hasPrev, false);
    });

    it("Lists 40 items by default", async () => {
      await seed(41);

      const result = await getCursor(items);

      assert.equal(result.items.length, 40);
      assert.equal(result.hasNext, true);
    });

    it("Is empty when the collection is", async () => {
      const result = await getCursor(items);

      assert.deepEqual(result.items, []);
      assert.equal(result.firstItem, undefined);
      assert.equal(result.lastItem, undefined);
      assert.equal(result.hasNext, false);
      assert.equal(result.hasPrev, false);
    });

    it("Pages forwards from an item", async () => {
      await seed(9);

      const result = await getCursor(
        items,
        await uidOf("item-6"),
        undefined,
        3,
      );

      assert.deepEqual(names(result), ["item-5", "item-4", "item-3"]);
      assert.equal(result.hasNext, true);
      assert.equal(result.hasPrev, true);
    });

    it("Pages backwards to the items adjacent to one", async () => {
      await seed(9);

      // Third page of three starts at item-2; going back belongs on page two
      const result = await getCursor(
        items,
        undefined,
        await uidOf("item-2"),
        3,
      );

      assert.deepEqual(names(result), ["item-5", "item-4", "item-3"]);
      assert.equal(result.hasNext, true);
      assert.equal(result.hasPrev, true);
    });

    it("Returns to the page it came from", async () => {
      await seed(9);

      let page = await getCursor(items, undefined, undefined, 3);
      page = await getCursor(items, page.lastItem, undefined, 3);
      const forwards = names(page);

      page = await getCursor(items, page.lastItem, undefined, 3);
      page = await getCursor(items, undefined, page.firstItem, 3);

      assert.deepEqual(names(page), forwards);
    });

    it("Pages backwards to a partial first page", async () => {
      await seed(9);

      const result = await getCursor(
        items,
        undefined,
        await uidOf("item-7"),
        3,
      );

      assert.deepEqual(names(result), ["item-8"]);
      assert.equal(result.hasNext, true);
      assert.equal(result.hasPrev, false);
    });

    it("Prefers before over after", async () => {
      await seed(9);

      const result = await getCursor(
        items,
        await uidOf("item-6"),
        await uidOf("item-2"),
        3,
      );

      assert.deepEqual(names(result), ["item-5", "item-4", "item-3"]);
    });

    it("Ignores a repeated cursor parameter", async () => {
      await seed(5);
      const uid = await uidOf("item-2");

      const result = await getCursor(items, undefined, [uid, uid], 3);

      assert.deepEqual(names(result), ["item-4", "item-3", "item-2"]);
      assert.equal(result.hasPrev, false);
    });

    it("Pages on from a cursor naming an item that no longer exists", async () => {
      await seed(5);
      const uid = await uidOf("item-2");
      await items.deleteOne({ "properties.uid": uid });

      const result = await getCursor(items, uid, undefined, 3);

      assert.deepEqual(names(result), ["item-1", "item-0"]);
    });

    it("Omits items that have no uid", async () => {
      await seed(5);
      await items.insertOne({ properties: { name: "item-x" } });

      const result = await getCursor(items);

      assert.deepEqual(names(result), [
        "item-4",
        "item-3",
        "item-2",
        "item-1",
        "item-0",
      ]);
    });
  });

  it("Connects to MongoDB database", async () => {
    const mongodbUrl = mongod.getUri();
    const result = await getMongodbClient(mongodbUrl);

    assert.equal(result.client.s.url, mongodbUrl);

    result.client.close();
  });

  it("Returns error if can’t create a MongoDB client", async () => {
    mock.method(console, "error", () => {});
    const consoleError = mock.method(console, "error", () => {});

    await getMongodbClient("https://foo.bar");
    const result = consoleError.mock.calls[0].arguments[0];

    assert.equal(
      result,
      `Could not create MongoDB client: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"`,
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
    const consoleError = mock.method(console, "error", () => {});

    try {
      const uri = authServer
        .getUri()
        .replace("mongodb://", "mongodb://foo:bar@");
      await getMongodbClient(uri);
      const result = consoleError.mock.calls[0].arguments[0];

      assert.equal(
        result,
        `Could not connect to MongoDB: Authentication failed.`,
      );
    } finally {
      await authServer.stop();
    }
  });
});
