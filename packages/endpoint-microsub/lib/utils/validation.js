/**
 * Input validation utilities for Microsub
 * @module utils/validation
 */

import { IndiekitError } from "@indiekit/error";

/**
 * Valid Microsub actions (PR 1: channels and timeline only)
 */
export const VALID_ACTIONS = ["channels", "timeline"];

/**
 * Validate action parameter
 * @param {string} action - Action to validate
 * @throws {IndiekitError} If action is invalid
 */
export function validateAction(action) {
  if (!action) {
    throw new IndiekitError("Missing required parameter: action", {
      status: 400,
    });
  }

  if (!VALID_ACTIONS.includes(action)) {
    throw new IndiekitError(`Invalid action: ${action}`, {
      status: 400,
    });
  }
}

/**
 * Validate channel UID
 * @param {string} channel - Channel UID to validate
 * @param {boolean} [required] - Whether channel is required
 * @throws {IndiekitError} If channel is invalid
 */
export function validateChannel(channel, required = true) {
  if (required && !channel) {
    throw new IndiekitError("Missing required parameter: channel", {
      status: 400,
    });
  }

  if (channel && typeof channel !== "string") {
    throw new IndiekitError("Invalid channel parameter", {
      status: 400,
    });
  }
}

/**
 * Validate entry/entries parameter
 * @param {string|Array} entry - Entry ID(s) to validate
 * @returns {Array} Array of entry IDs
 * @throws {IndiekitError} If entry is invalid
 */
export function validateEntries(entry) {
  if (!entry) {
    throw new IndiekitError("Missing required parameter: entry", {
      status: 400,
    });
  }

  // Normalize to array
  const entries = Array.isArray(entry) ? entry : [entry];

  if (entries.length === 0) {
    throw new IndiekitError("Entry parameter cannot be empty", {
      status: 400,
    });
  }

  return entries;
}

/**
 * Validate channel name
 * @param {string} name - Channel name to validate
 * @throws {IndiekitError} If name is invalid
 */
export function validateChannelName(name) {
  if (!name || typeof name !== "string") {
    throw new IndiekitError("Missing required parameter: name", {
      status: 400,
    });
  }

  if (name.length > 100) {
    throw new IndiekitError("Channel name must be 100 characters or less", {
      status: 400,
    });
  }
}

/**
 * Parse array parameter from request
 * Handles both array[] and array[0], array[1] formats
 * @param {object} body - Request body
 * @param {string} parameterName - Parameter name
 * @returns {Array} Parsed array
 */
export function parseArrayParameter(body, parameterName) {
  // Direct array
  if (Array.isArray(body[parameterName])) {
    return body[parameterName];
  }

  // Single value
  if (body[parameterName]) {
    return [body[parameterName]];
  }

  // Indexed values (param[0], param[1], ...)
  const result = [];
  let index = 0;
  while (body[`${parameterName}[${index}]`] !== undefined) {
    result.push(body[`${parameterName}[${index}]`]);
    index++;
  }

  // Array notation (param[])
  if (body[`${parameterName}[]`]) {
    const values = body[`${parameterName}[]`];
    return Array.isArray(values) ? values : [values];
  }

  return result;
}
