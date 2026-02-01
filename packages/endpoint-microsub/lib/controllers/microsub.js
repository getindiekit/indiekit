/**
 * Main Microsub action router
 * @module controllers/microsub
 */

import { IndiekitError } from "@indiekit/error";

import { validateAction } from "../utils/validation.js";

import { list as listChannels, action as channelAction } from "./channels.js";
import { get as getTimeline, action as timelineAction } from "./timeline.js";

/**
 * Route GET requests to appropriate action handler
 * @param {object} request - Express request
 * @param {object} response - Express response
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
export async function get(request, response, next) {
  try {
    const { action } = request.query;

    if (!action) {
      // Return basic endpoint info
      return response.json({
        type: "microsub",
        actions: ["channels", "timeline"],
      });
    }

    validateAction(action);

    switch (action) {
      case "channels": {
        return listChannels(request, response);
      }

      case "timeline": {
        return getTimeline(request, response);
      }

      default: {
        throw new IndiekitError(`Unsupported GET action: ${action}`, {
          status: 400,
        });
      }
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Route POST requests to appropriate action handler
 * @param {object} request - Express request
 * @param {object} response - Express response
 * @param {Function} next - Express next function
 * @returns {Promise<void>}
 */
export async function post(request, response, next) {
  try {
    const action = request.body.action || request.query.action;
    validateAction(action);

    switch (action) {
      case "channels": {
        return channelAction(request, response);
      }

      case "timeline": {
        return timelineAction(request, response);
      }

      default: {
        throw new IndiekitError(`Unsupported POST action: ${action}`, {
          status: 400,
        });
      }
    }
  } catch (error) {
    next(error);
  }
}

export const microsubController = { get, post };
