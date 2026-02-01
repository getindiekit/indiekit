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
import { getUserId } from "../utils/auth.js";
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
  const { application } = request.app.locals;
  const userId = getUserId(request);

  const channels = await getChannels(application, userId);

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
  const { application } = request.app.locals;
  const userId = getUserId(request);
  const { method, name, uid } = request.body;

  // Delete channel
  if (method === "delete") {
    validateChannel(uid);

    const deleted = await deleteChannel(application, uid, userId);
    if (!deleted) {
      throw new IndiekitError("Channel not found or cannot be deleted", {
        status: 404,
      });
    }

    return response.json({ deleted: uid });
  }

  // Reorder channels
  if (method === "order") {
    const channelUids = parseArrayParameter(request.body, "channels");
    if (channelUids.length === 0) {
      throw new IndiekitError("Missing channels[] parameter", {
        status: 400,
      });
    }

    await reorderChannels(application, channelUids, userId);

    const channels = await getChannels(application, userId);
    return response.json({ channels });
  }

  // Update existing channel
  if (uid) {
    validateChannel(uid);

    if (name) {
      validateChannelName(name);
    }

    const channel = await updateChannel(application, uid, { name }, userId);
    if (!channel) {
      throw new IndiekitError("Channel not found", {
        status: 404,
      });
    }

    return response.json({
      uid: channel.uid,
      name: channel.name,
    });
  }

  // Create new channel
  validateChannelName(name);

  const channel = await createChannel(application, { name, userId });

  response.status(201).json({
    uid: channel.uid,
    name: channel.name,
  });
}

export const channelsController = { list, action };
