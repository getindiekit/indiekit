/**
 * Channel storage operations
 * @module storage/channels
 */

import { generateChannelUid } from "../utils/uid.js";

/**
 * Get channels collection from application
 * @param {object} application - Indiekit application
 * @returns {object} MongoDB collection
 */
function getCollection(application) {
  return application.collections.get("microsub_channels");
}

/**
 * Get items collection for unread counts
 * @param {object} application - Indiekit application
 * @returns {object} MongoDB collection
 */
function getItemsCollection(application) {
  return application.collections.get("microsub_items");
}

/**
 * Create a new channel
 * @param {object} application - Indiekit application
 * @param {object} data - Channel data
 * @param {string} data.name - Channel name
 * @param {string} [data.userId] - User ID
 * @returns {Promise<object>} Created channel
 */
export async function createChannel(application, { name, userId }) {
  const collection = getCollection(application);

  // Generate unique UID with retry on collision
  let uid;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    uid = generateChannelUid();
    const existing = await collection.findOne({ uid });
    if (!existing) break;
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error("Failed to generate unique channel UID");
  }

  // Get max order for user
  const maxOrderResult = await collection
    .find({ userId })
    // eslint-disable-next-line unicorn/no-array-sort -- MongoDB cursor method
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
  const collection = getCollection(application);
  const itemsCollection = getItemsCollection(application);

  const filter = userId ? { userId } : {};
  // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-sort -- MongoDB methods
  const channels = await collection.find(filter).sort({ order: 1 }).toArray();

  // Get unread counts for each channel
  const channelsWithCounts = await Promise.all(
    channels.map(async (channel) => {
      const unreadCount = await itemsCollection.countDocuments({
        channelId: channel._id,
        readBy: { $ne: userId },
      });

      return {
        uid: channel.uid,
        name: channel.name,
        unread: unreadCount > 0 ? unreadCount : false,
      };
    }),
  );

  // Always include notifications channel first
  const notificationsChannel = channelsWithCounts.find(
    (c) => c.uid === "notifications",
  );
  const otherChannels = channelsWithCounts.filter(
    (c) => c.uid !== "notifications",
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
  const collection = getCollection(application);
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
  const collection = getCollection(application);
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
  const collection = getCollection(application);
  const itemsCollection = getItemsCollection(application);
  const query = { uid };
  if (userId) query.userId = userId;

  // Don't allow deleting notifications channel
  if (uid === "notifications") {
    return false;
  }

  // Find the channel first to get its ObjectId
  const channel = await collection.findOne(query);
  if (!channel) {
    return false;
  }

  // Delete all items in channel
  const itemsDeleted = await itemsCollection.deleteMany({
    channelId: channel._id,
  });
  console.info(
    `[Microsub] Deleted channel ${uid}: ${itemsDeleted.deletedCount} items`,
  );

  const result = await collection.deleteOne({ _id: channel._id });
  return result.deletedCount > 0;
}

/**
 * Reorder channels
 * @param {object} application - Indiekit application
 * @param {Array} channelUids - Ordered array of channel UIDs
 * @param {string} [userId] - User ID
 * @returns {Promise<void>}
 */
export async function reorderChannels(application, channelUids, userId) {
  const collection = getCollection(application);

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
  const collection = getCollection(application);

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
