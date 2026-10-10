import { strict as assert } from "node:assert";
import { after, beforeEach, describe, it } from "node:test";

import { uuidv7At } from "@indiekit/util";
import { testDatabase } from "@indiekit-test/database";

import {
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

const channel = "channel-1";
const otherChannel = "channel-2";

/**
 * Insert timeline items, oldest first
 * @param {number} count - Number of items to insert
 * @param {object} [overrides] - Fields to merge into each item
 * @returns {Promise<Array>} Inserted item documents
 */
async function insertItems(count, overrides = {}) {
  const documents = Array.from({ length: count }, (_, index) => {
    const published = new Date(Date.UTC(2026, 0, index + 1));

    return {
      channel,
      id: uuidv7At(published.getTime()),
      type: "entry",
      uid: `item-${index}`,
      url: `https://website.example/${index}`,
      name: `Item ${index}`,
      published,
      readBy: [],
      ...overrides,
    };
  });

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
      const result = await getTimelineItems(application, channel);

      assert.deepEqual(result.items, []);
      assert.deepEqual(result.paging, {});
    });

    it("Returns items newest first", async () => {
      await insertItems(3);

      const result = await getTimelineItems(application, channel);

      assert.deepEqual(
        result.items.map((item) => item.name),
        ["Item 2", "Item 1", "Item 0"],
      );
    });

    it("Excludes items from other channels", async () => {
      await insertItems(2);
      await items.insertOne({
        channel: otherChannel,
        id: uuidv7At(Date.now()),
        uid: "other",
        published: new Date(),
      });

      const result = await getTimelineItems(application, channel);

      assert.equal(result.items.length, 2);
    });

    it("Applies the requested limit", async () => {
      await insertItems(5);

      const result = await getTimelineItems(application, channel, {
        limit: 2,
      });

      assert.equal(result.items.length, 2);
    });

    it("Returns an after cursor when more items remain", async () => {
      await insertItems(5);

      const result = await getTimelineItems(application, channel, {
        limit: 2,
      });

      assert.ok(result.paging.after);
    });

    it("Pages back to newer items using the before cursor", async () => {
      await insertItems(4);

      const first = await getTimelineItems(application, channel, {
        limit: 2,
      });
      const second = await getTimelineItems(application, channel, {
        limit: 2,
        after: first.paging.after,
      });
      const back = await getTimelineItems(application, channel, {
        limit: 2,
        before: second.paging.before,
      });

      assert.deepEqual(
        back.items.map((item) => item.name),
        ["Item 3", "Item 2"],
      );
      assert.equal("before" in back.paging, false);
    });

    it("Pages through items using the after cursor", async () => {
      await insertItems(4);

      const first = await getTimelineItems(application, channel, {
        limit: 2,
      });
      const second = await getTimelineItems(application, channel, {
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

      const { items: result } = await getTimelineItems(application, channel);

      assert.equal(result[0].type, "entry");
      assert.equal(result[0].uid, "item-0");
      assert.equal(result[0].author, "Alice");
      assert.deepEqual(result[0].category, ["indieweb"]);
      assert.equal(typeof result[0].published, "string");
      const stored = await items.findOne({ uid: "item-0" });
      assert.equal(result[0]._id, stored.id);
    });

    it("Omits optional fields that are absent", async () => {
      await insertItems(1);

      const { items: result } = await getTimelineItems(application, channel);

      assert.equal("author" in result[0], false);
      assert.equal("category" in result[0], false);
    });

    it("Maps interaction properties to their jf2 names", async () => {
      await insertItems(1, {
        likeOf: ["https://website.example/liked"],
        inReplyTo: ["https://website.example/replied"],
      });

      const { items: result } = await getTimelineItems(application, channel);

      assert.deepEqual(result[0]["like-of"], ["https://website.example/liked"]);
      assert.deepEqual(result[0]["in-reply-to"], [
        "https://website.example/replied",
      ]);
    });

    it("Reports read state for the given user", async () => {
      await insertItems(1, { readBy: ["user-1"] });

      const { items: result } = await getTimelineItems(application, channel, {
        userId: "user-1",
      });

      assert.equal(result[0]._is_read, true);
    });

    it("Reports items as unread for a different user", async () => {
      await insertItems(1, { readBy: ["user-2"] });

      const { items: result } = await getTimelineItems(application, channel, {
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
        channel,
        ["item-0", "item-1"],
        "user-1",
      );

      assert.equal(count, 2);
      assert.equal(
        await items.countDocuments({ channel, readBy: "user-1" }),
        2,
      );
    });

    it("Matches items by URL", async () => {
      await insertItems(2);

      const count = await markItemsRead(
        application,
        channel,
        ["https://website.example/0"],
        "user-1",
      );

      assert.equal(count, 1);
    });

    it("Matches items by the id clients see", async () => {
      await insertItems(1);
      const item = await items.findOne({ uid: "item-0" });

      const count = await markItemsRead(
        application,
        channel,
        [item.id],
        "user-1",
      );

      assert.equal(count, 1);
    });

    it("Marks the whole channel read for last-read-entry", async () => {
      await insertItems(3);

      const count = await markItemsRead(
        application,
        channel,
        ["last-read-entry"],
        "user-1",
      );

      assert.equal(count, 3);
    });

    it("Does not mark items in other channels", async () => {
      await insertItems(1);
      await items.insertOne({
        channel: otherChannel,
        uid: "item-0",
        readBy: [],
      });

      await markItemsRead(application, channel, ["item-0"], "user-1");

      const other = await items.findOne({ channel: otherChannel });

      assert.deepEqual(other.readBy, []);
    });

    it("Does not add a duplicate user to readBy", async () => {
      await insertItems(1, { readBy: ["user-1"] });

      await markItemsRead(application, channel, ["item-0"], "user-1");

      const item = await items.findOne({ uid: "item-0" });

      assert.deepEqual(item.readBy, ["user-1"]);
    });
  });

  describe("markItemsUnread", () => {
    it("Removes the user from readBy", async () => {
      await insertItems(2, { readBy: ["user-1"] });

      const count = await markItemsUnread(
        application,
        channel,
        ["item-0"],
        "user-1",
      );

      assert.equal(count, 1);

      const item = await items.findOne({ uid: "item-0" });

      assert.deepEqual(item.readBy, []);
    });

    it("Leaves other users' read state intact", async () => {
      await insertItems(1, { readBy: ["user-1", "user-2"] });

      await markItemsUnread(application, channel, ["item-0"], "user-1");

      const item = await items.findOne({ uid: "item-0" });

      assert.deepEqual(item.readBy, ["user-2"]);
    });
  });

  describe("removeItems", () => {
    it("Deletes the given items", async () => {
      await insertItems(3);

      const count = await removeItems(application, channel, [
        "item-0",
        "item-1",
      ]);

      assert.equal(count, 2);
      assert.equal(await items.countDocuments({ channel }), 1);
    });

    it("Does not delete items in other channels", async () => {
      await insertItems(1);
      await items.insertOne({ channel: otherChannel, uid: "item-0" });

      await removeItems(application, channel, ["item-0"]);

      assert.equal(await items.countDocuments({ channel: otherChannel }), 1);
    });

    it("Returns 0 when nothing matches", async () => {
      await insertItems(1);

      const count = await removeItems(application, channel, ["nonexistent"]);

      assert.equal(count, 0);
    });
  });
});
