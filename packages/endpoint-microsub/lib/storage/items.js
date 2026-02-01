/**
 * Timeline item storage operations
 * @module storage/items
 */

import { ObjectId } from "mongodb";

import {
  buildPaginationQuery,
  buildPaginationSort,
  generatePagingCursors,
  parseLimit,
} from "../utils/pagination.js";

/**
 * Get items collection from application
 * @param {object} application - Indiekit application
 * @returns {object} MongoDB collection
 */
function getCollection(application) {
  return application.collections.get("microsub_items");
}

/**
 * Get timeline items for a channel
 * @param {object} application - Indiekit application
 * @param {ObjectId|string} channelId - Channel ObjectId
 * @param {object} options - Query options
 * @param {string} [options.before] - Before cursor
 * @param {string} [options.after] - After cursor
 * @param {number} [options.limit] - Items per page
 * @param {string} [options.userId] - User ID for read state
 * @returns {Promise<object>} Timeline with items and paging
 */
export async function getTimelineItems(application, channelId, options = {}) {
  const collection = getCollection(application);
  const objectId =
    typeof channelId === "string" ? new ObjectId(channelId) : channelId;
  const limit = parseLimit(options.limit);

  const baseQuery = { channelId: objectId };

  const query = buildPaginationQuery({
    before: options.before,
    after: options.after,
    baseQuery,
  });

  const sort = buildPaginationSort(options.before);

  // Fetch one extra to check if there are more
  const items = await collection
    // eslint-disable-next-line unicorn/no-array-callback-reference -- MongoDB query object
    .find(query)
    // eslint-disable-next-line unicorn/no-array-sort -- MongoDB cursor method
    .sort(sort)
    .limit(limit + 1)
    .toArray();

  const hasMore = items.length > limit;
  if (hasMore) {
    items.pop();
  }

  // Transform to jf2 format
  const jf2Items = items.map((item) => transformToJf2(item, options.userId));

  // Generate paging cursors
  const paging = generatePagingCursors(items, limit, hasMore, options.before);

  return {
    items: jf2Items,
    paging,
  };
}

/**
 * Transform database item to jf2 format
 * @param {object} item - Database item
 * @param {string} [userId] - User ID for read state
 * @returns {object} jf2 item
 */
function transformToJf2(item, userId) {
  const jf2 = {
    type: item.type,
    uid: item.uid,
    url: item.url,
    published: item.published?.toISOString(),
    _id: item._id.toString(),
    _is_read: userId ? item.readBy?.includes(userId) : false,
  };

  // Optional fields
  if (item.name) jf2.name = item.name;
  if (item.content) jf2.content = item.content;
  if (item.summary) jf2.summary = item.summary;
  if (item.updated) jf2.updated = item.updated.toISOString();
  if (item.author) jf2.author = item.author;
  if (item.category?.length > 0) jf2.category = item.category;
  if (item.photo?.length > 0) jf2.photo = item.photo;
  if (item.video?.length > 0) jf2.video = item.video;
  if (item.audio?.length > 0) jf2.audio = item.audio;

  // Interaction types
  if (item.likeOf?.length > 0) jf2["like-of"] = item.likeOf;
  if (item.repostOf?.length > 0) jf2["repost-of"] = item.repostOf;
  if (item.bookmarkOf?.length > 0) jf2["bookmark-of"] = item.bookmarkOf;
  if (item.inReplyTo?.length > 0) jf2["in-reply-to"] = item.inReplyTo;

  // Source
  if (item.source) jf2._source = item.source;

  return jf2;
}

/**
 * Mark items as read
 * @param {object} application - Indiekit application
 * @param {ObjectId|string} channelId - Channel ObjectId
 * @param {Array} entryIds - Array of entry IDs to mark as read
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of items updated
 */
export async function markItemsRead(application, channelId, entryIds, userId) {
  const collection = getCollection(application);
  const channelObjectId =
    typeof channelId === "string" ? new ObjectId(channelId) : channelId;

  // Handle "last-read-entry" special value
  if (entryIds.includes("last-read-entry")) {
    const result = await collection.updateMany(
      { channelId: channelObjectId },
      { $addToSet: { readBy: userId } },
    );
    return result.modifiedCount;
  }

  // Convert string IDs to ObjectIds where possible
  const objectIds = entryIds
    .map((id) => {
      try {
        return new ObjectId(id);
      } catch {
        return;
      }
    })
    .filter(Boolean);

  // Match by _id, uid, or url
  const result = await collection.updateMany(
    {
      channelId: channelObjectId,
      $or: [
        ...(objectIds.length > 0 ? [{ _id: { $in: objectIds } }] : []),
        { uid: { $in: entryIds } },
        { url: { $in: entryIds } },
      ],
    },
    { $addToSet: { readBy: userId } },
  );

  return result.modifiedCount;
}

/**
 * Mark items as unread
 * @param {object} application - Indiekit application
 * @param {ObjectId|string} channelId - Channel ObjectId
 * @param {Array} entryIds - Array of entry IDs to mark as unread
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of items updated
 */
export async function markItemsUnread(
  application,
  channelId,
  entryIds,
  userId,
) {
  const collection = getCollection(application);
  const channelObjectId =
    typeof channelId === "string" ? new ObjectId(channelId) : channelId;

  // Convert string IDs to ObjectIds where possible
  const objectIds = entryIds
    .map((id) => {
      try {
        return new ObjectId(id);
      } catch {
        return;
      }
    })
    .filter(Boolean);

  // Match by _id, uid, or url
  const result = await collection.updateMany(
    {
      channelId: channelObjectId,
      $or: [
        ...(objectIds.length > 0 ? [{ _id: { $in: objectIds } }] : []),
        { uid: { $in: entryIds } },
        { url: { $in: entryIds } },
      ],
    },
    { $pull: { readBy: userId } },
  );

  return result.modifiedCount;
}

/**
 * Remove items from channel
 * @param {object} application - Indiekit application
 * @param {ObjectId|string} channelId - Channel ObjectId
 * @param {Array} entryIds - Array of entry IDs to remove
 * @returns {Promise<number>} Number of items removed
 */
export async function removeItems(application, channelId, entryIds) {
  const collection = getCollection(application);
  const channelObjectId =
    typeof channelId === "string" ? new ObjectId(channelId) : channelId;

  // Convert string IDs to ObjectIds where possible
  const objectIds = entryIds
    .map((id) => {
      try {
        return new ObjectId(id);
      } catch {
        return;
      }
    })
    .filter(Boolean);

  // Match by _id, uid, or url
  const result = await collection.deleteMany({
    channelId: channelObjectId,
    $or: [
      ...(objectIds.length > 0 ? [{ _id: { $in: objectIds } }] : []),
      { uid: { $in: entryIds } },
      { url: { $in: entryIds } },
    ],
  });

  return result.deletedCount;
}

/**
 * Create indexes for efficient queries
 * @param {object} application - Indiekit application
 * @returns {Promise<void>}
 */
export async function createIndexes(application) {
  const collection = getCollection(application);

  // Primary query indexes
  await collection.createIndex({ channelId: 1, published: -1 });
  await collection.createIndex({ channelId: 1, uid: 1 }, { unique: true });

  // URL matching index for mark_read operations
  await collection.createIndex({ channelId: 1, url: 1 });
}
