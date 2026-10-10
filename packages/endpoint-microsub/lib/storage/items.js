/**
 * Timeline item storage operations
 * @module storage/items
 */

import { getCursor } from "@indiekit/util";

import { parseLimit } from "../utils/pagination.js";

import { getItemsCollection } from "./collections.js";

/**
 * Get timeline items for a channel
 * @param {object} application - Indiekit application
 * @param {string} channel - Channel uid
 * @param {object} options - Query options
 * @param {string} [options.before] - Before cursor
 * @param {string} [options.after] - After cursor
 * @param {number} [options.limit] - Items per page
 * @param {string} [options.userId] - User ID for read state
 * @returns {Promise<object>} Timeline with items and paging
 */
export async function getTimelineItems(application, channel, options = {}) {
  const collection = getItemsCollection(application);
  const limit = parseLimit(options.limit);

  // Items are listed and paged by their `id`, a UUIDv7 stamped with the
  // publication date, through the same cursor posts and media use.
  const cursor = await getCursor(
    collection,
    options.after,
    options.before,
    limit,
    { filter: { channel }, key: "id" },
  );

  const items = cursor.items.map((item) =>
    transformToJf2(item, options.userId),
  );

  // Microsub paging: `after` continues down to older items, `before` back
  // up to newer ones
  const paging = {};
  if (cursor.hasNext) {
    paging.after = cursor.lastItem;
  }
  if (cursor.hasPrev) {
    paging.before = cursor.firstItem;
  }

  return { items, paging };
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
    _id: item.id,
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
 * @param {string} channel - Channel uid
 * @param {Array} entryIds - Array of entry IDs to mark as read
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of items updated
 */
export async function markItemsRead(application, channel, entryIds, userId) {
  const collection = getItemsCollection(application);

  // Handle "last-read-entry" special value
  if (entryIds.includes("last-read-entry")) {
    const result = await collection.updateMany(
      { channel },
      { $addToSet: { readBy: userId } },
    );
    return result.modifiedCount;
  }

  // Match by the id clients see, the feed's own uid, or url
  const result = await collection.updateMany(
    {
      channel,
      $or: [
        { id: { $in: entryIds } },
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
 * @param {string} channel - Channel uid
 * @param {Array} entryIds - Array of entry IDs to mark as unread
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of items updated
 */
export async function markItemsUnread(application, channel, entryIds, userId) {
  const collection = getItemsCollection(application);

  // Match by the id clients see, the feed's own uid, or url
  const result = await collection.updateMany(
    {
      channel,
      $or: [
        { id: { $in: entryIds } },
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
 * @param {string} channel - Channel uid
 * @param {Array} entryIds - Array of entry IDs to remove
 * @returns {Promise<number>} Number of items removed
 */
export async function removeItems(application, channel, entryIds) {
  const collection = getItemsCollection(application);

  // Match by the id clients see, the feed's own uid, or url
  const result = await collection.deleteMany({
    channel,
    $or: [
      { id: { $in: entryIds } },
      { uid: { $in: entryIds } },
      { url: { $in: entryIds } },
    ],
  });

  return result.deletedCount;
}
