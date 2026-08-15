import { strict as assert } from "node:assert";
import { after, beforeEach, describe, it } from "node:test";

import { testDatabase } from "@indiekit-test/database";
import { ObjectId } from "mongodb";

import {
  createIndexes,
  getTimelineItems,
  markItemsRead,
  markItemsUnread,
  removeItems,
} from "../../../lib/storage/items.js";

const { client, database, mongoServer } = await testDatabase();
const items = database.collection("microsub_items");
const application = {
  collections: new Map([["microsub_items", items]]),
};

const channelId = new ObjectId();
const otherChannelId = new ObjectId();

/**
 * Insert timeline items, oldest first
 * @param {number} count - Number of items to insert
 * @param {object} [overrides] - Fields to merge into each item
 * @returns {Promise<Array>} Inserted item documents
 */
async function insertItems(count, overrides = {}) {
  const documents = Array.from({ length: count }, (_, index) => ({
    channelId,
    type: "entry",
    uid: `item-${index}`,
    url: `https://website.example/${index}`,
    name: `Item ${index}`,
    published: new Date(Date.UTC(2026, 0, index + 1)),
    readBy: [],
    ...overrides,
  }));

  await items.insertMany(documents);

  return documents;
}

describe("endpoint-microsub/lib/storage/items", () => {
  beforeEach(async () => {
    await items.deleteMany({});
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
  });

  describe("getTimelineItems", () => {
    it("Returns an empty timeline when the channel has no items", async () => {
      const result = await getTimelineItems(application, channelId);

      assert.deepEqual(result.items, []);
      assert.deepEqual(result.paging, {});
    });

    it("Returns items newest first", async () => {
      await insertItems(3);

      const result = await getTimelineItems(application, channelId);

      assert.deepEqual(
        result.items.map((item) => item.name),
        ["Item 2", "Item 1", "Item 0"],
      );
    });

    it("Excludes items from other channels", async () => {
      await insertItems(2);
      await items.insertOne({
        channelId: otherChannelId,
        uid: "other",
        published: new Date(),
      });

      const result = await getTimelineItems(application, channelId);

      assert.equal(result.items.length, 2);
    });

    it("Accepts a channel ID as a string", async () => {
      await insertItems(2);

      const result = await getTimelineItems(application, channelId.toString());

      assert.equal(result.items.length, 2);
    });

    it("Applies the requested limit", async () => {
      await insertItems(5);

      const result = await getTimelineItems(application, channelId, {
        limit: 2,
      });

      assert.equal(result.items.length, 2);
    });

    it("Returns an after cursor when more items remain", async () => {
      await insertItems(5);

      const result = await getTimelineItems(application, channelId, {
        limit: 2,
      });

      assert.ok(result.paging.after);
    });

    it("Pages through items using the after cursor", async () => {
      await insertItems(4);

      const first = await getTimelineItems(application, channelId, {
        limit: 2,
      });
      const second = await getTimelineItems(application, channelId, {
        limit: 2,
        after: first.paging.after,
      });

      assert.deepEqual(
        second.items.map((item) => item.name),
        ["Item 1", "Item 0"],
      );
    });

    it("Transforms items to jf2", async () => {
      await insertItems(1, { author: "Alice", category: ["indieweb"] });

      const { items: result } = await getTimelineItems(application, channelId);

      assert.equal(result[0].type, "entry");
      assert.equal(result[0].uid, "item-0");
      assert.equal(result[0].author, "Alice");
      assert.deepEqual(result[0].category, ["indieweb"]);
      assert.equal(typeof result[0].published, "string");
      assert.equal(typeof result[0]._id, "string");
    });

    it("Omits optional fields that are absent", async () => {
      await insertItems(1);

      const { items: result } = await getTimelineItems(application, channelId);

      assert.equal("author" in result[0], false);
      assert.equal("category" in result[0], false);
    });

    it("Maps interaction properties to their jf2 names", async () => {
      await insertItems(1, {
        likeOf: ["https://website.example/liked"],
        inReplyTo: ["https://website.example/replied"],
      });

      const { items: result } = await getTimelineItems(application, channelId);

      assert.deepEqual(result[0]["like-of"], ["https://website.example/liked"]);
      assert.deepEqual(result[0]["in-reply-to"], [
        "https://website.example/replied",
      ]);
    });

    it("Reports read state for the given user", async () => {
      await insertItems(1, { readBy: ["user-1"] });

      const { items: result } = await getTimelineItems(application, channelId, {
        userId: "user-1",
      });

      assert.equal(result[0]._is_read, true);
    });

    it("Reports items as unread for a different user", async () => {
      await insertItems(1, { readBy: ["user-2"] });

      const { items: result } = await getTimelineItems(application, channelId, {
        userId: "user-1",
      });

      assert.equal(result[0]._is_read, false);
    });
  });

  describe("markItemsRead", () => {
    it("Marks the given items as read", async () => {
      await insertItems(3);

      const count = await markItemsRead(
        application,
        channelId,
        ["item-0", "item-1"],
        "user-1",
      );

      assert.equal(count, 2);
      assert.equal(
        await items.countDocuments({ channelId, readBy: "user-1" }),
        2,
      );
    });

    it("Matches items by URL", async () => {
      await insertItems(2);

      const count = await markItemsRead(
        application,
        channelId,
        ["https://website.example/0"],
        "user-1",
      );

      assert.equal(count, 1);
    });

    it("Matches items by ObjectId", async () => {
      await insertItems(1);
      const item = await items.findOne({ uid: "item-0" });

      const count = await markItemsRead(
        application,
        channelId,
        [item._id.toString()],
        "user-1",
      );

      assert.equal(count, 1);
    });

    it("Marks the whole channel read for last-read-entry", async () => {
      await insertItems(3);

      const count = await markItemsRead(
        application,
        channelId,
        ["last-read-entry"],
        "user-1",
      );

      assert.equal(count, 3);
    });

    it("Does not mark items in other channels", async () => {
      await insertItems(1);
      await items.insertOne({
        channelId: otherChannelId,
        uid: "item-0",
        readBy: [],
      });

      await markItemsRead(application, channelId, ["item-0"], "user-1");

      const other = await items.findOne({ channelId: otherChannelId });

      assert.deepEqual(other.readBy, []);
    });

    it("Does not add a duplicate user to readBy", async () => {
      await insertItems(1, { readBy: ["user-1"] });

      await markItemsRead(application, channelId, ["item-0"], "user-1");

      const item = await items.findOne({ uid: "item-0" });

      assert.deepEqual(item.readBy, ["user-1"]);
    });
  });

  describe("markItemsUnread", () => {
    it("Removes the user from readBy", async () => {
      await insertItems(2, { readBy: ["user-1"] });

      const count = await markItemsUnread(
        application,
        channelId,
        ["item-0"],
        "user-1",
      );

      assert.equal(count, 1);

      const item = await items.findOne({ uid: "item-0" });

      assert.deepEqual(item.readBy, []);
    });

    it("Leaves other users' read state intact", async () => {
      await insertItems(1, { readBy: ["user-1", "user-2"] });

      await markItemsUnread(application, channelId, ["item-0"], "user-1");

      const item = await items.findOne({ uid: "item-0" });

      assert.deepEqual(item.readBy, ["user-2"]);
    });
  });

  describe("removeItems", () => {
    it("Deletes the given items", async () => {
      await insertItems(3);

      const count = await removeItems(application, channelId, [
        "item-0",
        "item-1",
      ]);

      assert.equal(count, 2);
      assert.equal(await items.countDocuments({ channelId }), 1);
    });

    it("Does not delete items in other channels", async () => {
      await insertItems(1);
      await items.insertOne({ channelId: otherChannelId, uid: "item-0" });

      await removeItems(application, channelId, ["item-0"]);

      assert.equal(
        await items.countDocuments({ channelId: otherChannelId }),
        1,
      );
    });

    it("Returns 0 when nothing matches", async () => {
      await insertItems(1);

      const count = await removeItems(application, channelId, ["nonexistent"]);

      assert.equal(count, 0);
    });
  });

  describe("createIndexes", () => {
    it("Creates the expected indexes", async () => {
      await createIndexes(application);

      const indexes = await items.indexes();
      const keys = new Set(indexes.map((index) => JSON.stringify(index.key)));

      assert.ok(keys.has(JSON.stringify({ channelId: 1, published: -1 })));
      assert.ok(keys.has(JSON.stringify({ channelId: 1, uid: 1 })));
      assert.ok(keys.has(JSON.stringify({ channelId: 1, url: 1 })));
    });
  });
});
