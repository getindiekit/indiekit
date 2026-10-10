/**
 * Channel storage operations
 * @module storage/channels
 */

import { randomString } from "@indiekit/util";
import makeDebug from "debug";

import { getChannelsCollection, getItemsCollection } from "./collections.js";

const debug = makeDebug("indiekit:endpoint-microsub");

/**
 * Create a new channel
 * @param {object} application - Indiekit application
 * @param {object} data - Channel data
 * @param {string} data.name - Channel name
 * @param {string} [data.userId] - User ID
 * @returns {Promise<object>} Created channel
 */
export async function createChannel(application, { name, userId }) {
  const collection = getChannelsCollection(application);

  // 24 base64url characters are 144 random bits: a collision is not a case
  // to handle, and the uid is what clients and URLs name the channel by
  const uid = randomString(24);

  // Get max order for user
  const maxOrderResult = await collection
    .find({ userId })
    .sort({ order: -1 })
    .limit(1)
    .toArray();

  const order = maxOrderResult.length > 0 ? maxOrderResult[0].order + 1 : 0;

  const channel = {
    uid,
    name,
    userId,
    order,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await collection.insertOne(channel);

  return channel;
}

/**
 * Get all channels for a user
 * @param {object} application - Indiekit application
 * @param {string} [userId] - User ID (optional for single-user mode)
 * @returns {Promise<Array>} Array of channels with unread counts
 */
export async function getChannels(application, userId) {
  const collection = getChannelsCollection(application);
  const itemsCollection = getItemsCollection(application);

  const filter = userId ? { userId } : {};
  // eslint-disable-next-line unicorn/no-array-callback-reference -- MongoDB methods
  const channels = await collection.find(filter).sort({ order: 1 }).toArray();

  // Get unread counts for each channel
  const channelsWithCounts = await Promise.all(
    channels.map(async (channel) => {
      const unreadCount = await itemsCollection.countDocuments({
        channel: channel.uid,
        readBy: { $ne: userId },
      });

      return {
        uid: channel.uid,
        name: channel.name,
        unread: unreadCount > 0 && unreadCount,
      };
    }),
  );

  // Always include notifications channel first
  const notificationsChannel = channelsWithCounts.find(
    (channel) => channel.uid === "notifications",
  );
  const otherChannels = channelsWithCounts.filter(
    (channel) => channel.uid !== "notifications",
  );

  if (notificationsChannel) {
    return [notificationsChannel, ...otherChannels];
  }

  return channelsWithCounts;
}

/**
 * Get a single channel by UID
 * @param {object} application - Indiekit application
 * @param {string} uid - Channel UID
 * @param {string} [userId] - User ID
 * @returns {Promise<object|null>} Channel or null
 */
export async function getChannel(application, uid, userId) {
  const collection = getChannelsCollection(application);
  const query = { uid };
  if (userId) query.userId = userId;

  return collection.findOne(query);
}

/**
 * Update a channel
 * @param {object} application - Indiekit application
 * @param {string} uid - Channel UID
 * @param {object} updates - Fields to update
 * @param {string} [userId] - User ID
 * @returns {Promise<object|null>} Updated channel
 */
export async function updateChannel(application, uid, updates, userId) {
  const collection = getChannelsCollection(application);
  const query = { uid };
  if (userId) query.userId = userId;

  const result = await collection.findOneAndUpdate(
    query,
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );

  return result;
}

/**
 * Delete a channel and all its items
 * @param {object} application - Indiekit application
 * @param {string} uid - Channel UID
 * @param {string} [userId] - User ID
 * @returns {Promise<boolean>} True if deleted
 */
export async function deleteChannel(application, uid, userId) {
  const collection = getChannelsCollection(application);
  const itemsCollection = getItemsCollection(application);
  const query = { uid };
  if (userId) query.userId = userId;

  // Don't allow deleting notifications channel
  if (uid === "notifications") {
    return false;
  }

  const result = await collection.deleteOne(query);
  if (result.deletedCount === 0) {
    return false;
  }

  // Delete all items in channel
  const itemsDeleted = await itemsCollection.deleteMany({ channel: uid });
  debug(`Deleted channel ${uid}: ${itemsDeleted.deletedCount} items`);

  return true;
}

/**
 * Reorder channels
 * @param {object} application - Indiekit application
 * @param {Array} channelUids - Ordered array of channel UIDs
 * @param {string} [userId] - User ID
 * @returns {Promise<void>}
 */
export async function reorderChannels(application, channelUids, userId) {
  const collection = getChannelsCollection(application);

  // Update order for each channel
  const operations = channelUids.map((uid, index) => ({
    updateOne: {
      filter: userId ? { uid, userId } : { uid },
      update: { $set: { order: index, updatedAt: new Date() } },
    },
  }));

  if (operations.length > 0) {
    await collection.bulkWrite(operations);
  }
}

/**
 * Ensure notifications channel exists
 * @param {object} application - Indiekit application
 * @param {string} [userId] - User ID
 * @returns {Promise<object>} Notifications channel
 */
export async function ensureNotificationsChannel(application, userId) {
  const collection = getChannelsCollection(application);

  const existing = await collection.findOne({
    uid: "notifications",
    ...(userId && { userId }),
  });

  if (existing) {
    return existing;
  }

  // Create notifications channel
  const channel = {
    uid: "notifications",
    name: "Notifications",
    userId,
    order: -1, // Always first
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await collection.insertOne(channel);
  return channel;
}
