import { strict as assert } from "node:assert";
import { after, beforeEach, describe, it, mock } from "node:test";

import { testDatabase } from "@indiekit-test/database";

import {
  createChannel,
  deleteChannel,
  ensureNotificationsChannel,
  getChannel,
  getChannels,
  reorderChannels,
  updateChannel,
} from "../../../lib/storage/channels.js";

mock.method(console, "info", () => {}); // Disable console.info

const { client, database, mongoServer } = await testDatabase();
const channels = database.collection("microsub_channels");
const items = database.collection("microsub_items");
const application = {
  collections: new Map([
    ["microsub_channels", channels],
    ["microsub_items", items],
  ]),
};

describe("endpoint-microsub/lib/storage/channels", () => {
  beforeEach(async () => {
    await channels.deleteMany({});
    await items.deleteMany({});
  });

  after(async () => {
    await client.close();
    await mongoServer.stop();
  });

  describe("createChannel", () => {
    it("Creates a channel with a generated UID", async () => {
      const channel = await createChannel(application, {
        name: "Tech News",
        userId: "user-1",
      });

      assert.match(channel.uid, /^[a-z0-9]{24}$/);
      assert.equal(channel.name, "Tech News");
      assert.equal(channel.userId, "user-1");
      assert.ok(channel.createdAt instanceof Date);
    });

    it("Persists the channel", async () => {
      const channel = await createChannel(application, {
        name: "Tech News",
        userId: "user-1",
      });

      const stored = await channels.findOne({ uid: channel.uid });

      assert.equal(stored.name, "Tech News");
    });

    it("Assigns order 0 to a user's first channel", async () => {
      const channel = await createChannel(application, {
        name: "First",
        userId: "user-1",
      });

      assert.equal(channel.order, 0);
    });

    it("Increments order for subsequent channels", async () => {
      await createChannel(application, { name: "First", userId: "user-1" });
      const second = await createChannel(application, {
        name: "Second",
        userId: "user-1",
      });

      assert.equal(second.order, 1);
    });

    it("Tracks order separately for each user", async () => {
      await createChannel(application, { name: "First", userId: "user-1" });
      const other = await createChannel(application, {
        name: "Other",
        userId: "user-2",
      });

      assert.equal(other.order, 0);
    });
  });

  describe("getChannels", () => {
    it("Returns an empty array when no channels exist", async () => {
      const result = await getChannels(application, "user-1");

      assert.deepEqual(result, []);
    });

    it("Returns channels in order", async () => {
      await createChannel(application, { name: "First", userId: "user-1" });
      await createChannel(application, { name: "Second", userId: "user-1" });

      const result = await getChannels(application, "user-1");

      assert.deepEqual(
        result.map((channel) => channel.name),
        ["First", "Second"],
      );
    });

    it("Returns only the requested user's channels", async () => {
      await createChannel(application, { name: "Mine", userId: "user-1" });
      await createChannel(application, { name: "Theirs", userId: "user-2" });

      const result = await getChannels(application, "user-1");

      assert.equal(result.length, 1);
      assert.equal(result[0].name, "Mine");
    });

    it("Returns false as unread count when all items are read", async () => {
      const channel = await createChannel(application, {
        name: "Tech News",
        userId: "user-1",
      });
      const stored = await channels.findOne({ uid: channel.uid });
      await items.insertOne({ channelId: stored._id, readBy: ["user-1"] });

      const result = await getChannels(application, "user-1");

      assert.equal(result[0].unread, false);
    });

    it("Counts items not yet read by the user", async () => {
      const channel = await createChannel(application, {
        name: "Tech News",
        userId: "user-1",
      });
      const stored = await channels.findOne({ uid: channel.uid });
      await items.insertMany([
        { channelId: stored._id, readBy: [] },
        { channelId: stored._id, readBy: [] },
        { channelId: stored._id, readBy: ["user-1"] },
      ]);

      const result = await getChannels(application, "user-1");

      assert.equal(result[0].unread, 2);
    });

    it("Lists the notifications channel first", async () => {
      await createChannel(application, { name: "Tech News", userId: "user-1" });
      await ensureNotificationsChannel(application, "user-1");

      const result = await getChannels(application, "user-1");

      assert.equal(result[0].uid, "notifications");
    });
  });

  describe("getChannel", () => {
    it("Returns a channel by UID", async () => {
      const channel = await createChannel(application, {
        name: "Tech News",
        userId: "user-1",
      });

      const result = await getChannel(application, channel.uid, "user-1");

      assert.equal(result.name, "Tech News");
    });

    it("Returns null for an unknown UID", async () => {
      const result = await getChannel(application, "nonexistent", "user-1");

      // eslint-disable-next-line unicorn/no-null -- MongoDB returns null
      assert.equal(result, null);
    });

    it("Does not return another user's channel", async () => {
      const channel = await createChannel(application, {
        name: "Theirs",
        userId: "user-2",
      });

      const result = await getChannel(application, channel.uid, "user-1");

      // eslint-disable-next-line unicorn/no-null -- MongoDB returns null
      assert.equal(result, null);
    });
  });

  describe("updateChannel", () => {
    it("Updates the channel name", async () => {
      const channel = await createChannel(application, {
        name: "Old name",
        userId: "user-1",
      });

      const result = await updateChannel(
        application,
        channel.uid,
        { name: "New name" },
        "user-1",
      );

      assert.equal(result.name, "New name");
    });

    it("Returns null for an unknown UID", async () => {
      const result = await updateChannel(
        application,
        "nonexistent",
        { name: "New name" },
        "user-1",
      );

      // eslint-disable-next-line unicorn/no-null -- MongoDB returns null
      assert.equal(result, null);
    });
  });

  describe("deleteChannel", () => {
    it("Deletes the channel", async () => {
      const channel = await createChannel(application, {
        name: "Tech News",
        userId: "user-1",
      });

      const result = await deleteChannel(application, channel.uid, "user-1");

      assert.equal(result, true);
      assert.equal(await channels.countDocuments({ uid: channel.uid }), 0);
    });

    it("Deletes the channel's items", async () => {
      const channel = await createChannel(application, {
        name: "Tech News",
        userId: "user-1",
      });
      const stored = await channels.findOne({ uid: channel.uid });
      await items.insertOne({ channelId: stored._id });

      await deleteChannel(application, channel.uid, "user-1");

      assert.equal(await items.countDocuments({ channelId: stored._id }), 0);
    });

    it("Refuses to delete the notifications channel", async () => {
      await ensureNotificationsChannel(application, "user-1");

      const result = await deleteChannel(
        application,
        "notifications",
        "user-1",
      );

      assert.equal(result, false);
      assert.equal(await channels.countDocuments({ uid: "notifications" }), 1);
    });

    it("Returns false for an unknown UID", async () => {
      const result = await deleteChannel(application, "nonexistent", "user-1");

      assert.equal(result, false);
    });
  });

  describe("reorderChannels", () => {
    it("Applies the given order", async () => {
      const first = await createChannel(application, {
        name: "First",
        userId: "user-1",
      });
      const second = await createChannel(application, {
        name: "Second",
        userId: "user-1",
      });

      await reorderChannels(application, [second.uid, first.uid], "user-1");

      const result = await getChannels(application, "user-1");

      assert.deepEqual(
        result.map((channel) => channel.name),
        ["Second", "First"],
      );
    });

    it("Does nothing when given an empty list", async () => {
      await createChannel(application, { name: "First", userId: "user-1" });

      await reorderChannels(application, [], "user-1");

      const result = await getChannels(application, "user-1");

      assert.equal(result.length, 1);
    });
  });

  describe("ensureNotificationsChannel", () => {
    it("Creates the notifications channel", async () => {
      const channel = await ensureNotificationsChannel(application, "user-1");

      assert.equal(channel.uid, "notifications");
      assert.equal(channel.name, "Notifications");
      assert.equal(channel.order, -1);
    });

    it("Returns the existing channel without duplicating it", async () => {
      const first = await ensureNotificationsChannel(application, "user-1");
      const second = await ensureNotificationsChannel(application, "user-1");

      assert.equal(second._id.toString(), first._id.toString());
      assert.equal(await channels.countDocuments({ uid: "notifications" }), 1);
    });
  });
});
