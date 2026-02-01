/**
 * Timeline controller
 * @module controllers/timeline
 */

import { IndiekitError } from "@indiekit/error";

import { getChannel } from "../storage/channels.js";
import {
  getTimelineItems,
  markItemsRead,
  markItemsUnread,
  removeItems,
} from "../storage/items.js";
import { getUserId } from "../utils/auth.js";
import {
  validateChannel,
  validateEntries,
  parseArrayParameter,
} from "../utils/validation.js";

/**
 * Get timeline items for a channel
 * GET ?action=timeline&channel=<uid>
 * @param {object} request - Express request
 * @param {object} response - Express response
 */
export async function get(request, response) {
  const { application } = request.app.locals;
  const userId = getUserId(request);
  const { channel, before, after, limit } = request.query;

  validateChannel(channel);

  // Verify channel exists
  const channelDocument = await getChannel(application, channel, userId);
  if (!channelDocument) {
    throw new IndiekitError("Channel not found", {
      status: 404,
    });
  }

  const timeline = await getTimelineItems(application, channelDocument._id, {
    before,
    after,
    limit,
    userId,
  });

  response.json(timeline);
}

/**
 * Handle timeline actions (mark_read, mark_unread, remove)
 * POST ?action=timeline
 * @param {object} request - Express request
 * @param {object} response - Express response
 * @returns {Promise<void>}
 */
export async function action(request, response) {
  const { application } = request.app.locals;
  const userId = getUserId(request);
  const { method, channel } = request.body;

  validateChannel(channel);

  // Verify channel exists
  const channelDocument = await getChannel(application, channel, userId);
  if (!channelDocument) {
    throw new IndiekitError("Channel not found", {
      status: 404,
    });
  }

  // Get entry IDs from request
  const entries = parseArrayParameter(request.body, "entry");

  switch (method) {
    case "mark_read": {
      validateEntries(entries);
      const count = await markItemsRead(
        application,
        channelDocument._id,
        entries,
        userId,
      );
      return response.json({ result: "ok", updated: count });
    }

    case "mark_unread": {
      validateEntries(entries);
      const count = await markItemsUnread(
        application,
        channelDocument._id,
        entries,
        userId,
      );
      return response.json({ result: "ok", updated: count });
    }

    case "remove": {
      validateEntries(entries);
      const count = await removeItems(
        application,
        channelDocument._id,
        entries,
      );
      return response.json({ result: "ok", removed: count });
    }

    default: {
      throw new IndiekitError(`Invalid timeline method: ${method}`, {
        status: 400,
      });
    }
  }
}

export const timelineController = { get, action };
