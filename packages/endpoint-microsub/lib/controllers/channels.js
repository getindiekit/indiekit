/**
 * Channel management controller
 * @module controllers/channels
 */

import { IndiekitError } from "@indiekit/error";

import {
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  reorderChannels,
} from "../storage/channels.js";
import {
  validateChannel,
  validateChannelName,
  parseArrayParameter,
} from "../utils/validation.js";

/**
 * List all channels
 * GET ?action=channels
 * @param {object} request - Express request
 * @param {object} response - Express response
 */
export async function list(request, response) {
  const { application, publication } = request.app.locals;

  const channels = await getChannels(application, publication.me);

  response.json({ channels });
}

/**
 * Handle channel actions (create, update, delete, order)
 * POST ?action=channels
 * @param {object} request - Express request
 * @param {object} response - Express response
 * @returns {Promise<void>}
 */
export async function action(request, response) {
  const { application, publication } = request.app.locals;
  const { __ } = response.locals;
  const userId = publication.me;
  const { method, name, uid } = request.body;

  // Delete channel
  if (method === "delete") {
    validateChannel(__, uid);

    const deleted = await deleteChannel(application, uid, userId);
    if (!deleted) {
      throw IndiekitError.notFound(__("microsub.error.channelNotFound"));
    }

    return response.json({ deleted: uid });
  }

  // Reorder channels
  if (method === "order") {
    const channelUids = parseArrayParameter(request.body, "channels");
    if (channelUids.length === 0) {
      throw IndiekitError.badRequest(
        __("BadRequestError.missingParameter", "channels"),
      );
    }

    await reorderChannels(application, channelUids, userId);

    const channels = await getChannels(application, userId);
    return response.json({ channels });
  }

  // Update existing channel
  if (uid) {
    validateChannel(__, uid);

    if (name) {
      validateChannelName(__, name);
    }

    const channel = await updateChannel(application, uid, { name }, userId);
    if (!channel) {
      throw IndiekitError.notFound(__("microsub.error.channelNotFound"));
    }

    return response.json({
      uid: channel.uid,
      name: channel.name,
    });
  }

  // Create new channel
  validateChannelName(__, name);

  const channel = await createChannel(application, { name, userId });

  response.status(201).json({
    uid: channel.uid,
    name: channel.name,
  });
}

export const channelsController = { list, action };
