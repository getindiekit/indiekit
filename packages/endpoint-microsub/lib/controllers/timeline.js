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
import {
  validateChannel,
  validateEntries,
  parseArrayParameter,
} from "../utils/validation.js";

/**
 * @typedef {object} TimelineQueryParameters
 * @property {string} [channel] - Channel UID
 * @property {string|string[]} [before] - Return items before this item ID
 * @property {string|string[]} [after] - Return items after this item ID
 * @property {string} [limit] - Number of items to return
 */

/**
 * Get timeline items for a channel
 * GET ?action=timeline&channel=<uid>
 * @param {Request} request - Express request
 * @param {Response} response - Express response
 */
export async function get(request, response) {
  const { application, publication } = request.app.locals;
  const { __ } = response.locals;
  const userId = publication.me;
  const { channel, before, after, limit } =
    /** @type {TimelineQueryParameters} */ (request.query);

  validateChannel(__, channel);

  // Verify channel exists
  const channelDocument = await getChannel(application, channel, userId);
  if (!channelDocument) {
    throw IndiekitError.notFound(__("microsub.error.channelNotFound"));
  }

  const timeline = await getTimelineItems(application, channelDocument.uid, {
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
 * @param {Request} request - Express request
 * @param {Response} response - Express response
 * @returns {Promise<void>}
 */
export async function action(request, response) {
  const { application, publication } = request.app.locals;
  const { __ } = response.locals;
  const userId = publication.me;
  const { method, channel } = request.body;

  validateChannel(__, channel);

  // Verify channel exists
  const channelDocument = await getChannel(application, channel, userId);
  if (!channelDocument) {
    throw IndiekitError.notFound(__("microsub.error.channelNotFound"));
  }

  // Get entry IDs from request
  const entries = parseArrayParameter(request.body, "entry");

  switch (method) {
    case "mark_read": {
      validateEntries(__, entries);
      const count = await markItemsRead(
        application,
        channelDocument.uid,
        entries,
        userId,
      );
      return void response.json({ result: "ok", updated: count });
    }

    case "mark_unread": {
      validateEntries(__, entries);
      const count = await markItemsUnread(
        application,
        channelDocument.uid,
        entries,
        userId,
      );
      return void response.json({ result: "ok", updated: count });
    }

    case "remove": {
      validateEntries(__, entries);
      const count = await removeItems(
        application,
        channelDocument.uid,
        entries,
      );
      return void response.json({ result: "ok", removed: count });
    }

    default: {
      throw IndiekitError.badRequest(
        __("BadRequestError.invalidValue", "method"),
      );
    }
  }
}

export const timelineController = { get, action };

/**
 * @import { Request, Response } from "express"
 */
