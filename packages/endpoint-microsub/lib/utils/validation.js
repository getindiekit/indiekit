/**
 * Input validation utilities for Microsub
 * @module utils/validation
 */

import { IndiekitError } from "@indiekit/error";

/**
 * Microsub actions this endpoint supports
 */
export const VALID_ACTIONS = ["channels", "timeline"];

/**
 * Longest channel name accepted
 */
export const MAX_NAME_LENGTH = 100;

/**
 * Validate action parameter
 * @param {(key: string, ...values: Array<string | number>) => string} __ - Localisation function
 * @param {string|null} [action] - Action to validate
 * @throws {IndiekitError} If action is invalid
 */
export function validateAction(__, action) {
  if (!action) {
    throw IndiekitError.badRequest(
      __("BadRequestError.missingParameter", "action"),
    );
  }

  if (!VALID_ACTIONS.includes(action)) {
    throw IndiekitError.badRequest(
      __("BadRequestError.invalidValue", "action"),
    );
  }
}

/**
 * Validate channel UID
 * @param {(key: string, ...values: Array<string | number>) => string} __ - Localisation function
 * @param {string} [channel] - Channel UID to validate
 * @param {boolean} [isRequired] - Whether channel is required
 * @throws {IndiekitError} If channel is invalid
 */
export function validateChannel(__, channel, isRequired = true) {
  if (isRequired && !channel) {
    throw IndiekitError.badRequest(
      __("BadRequestError.missingParameter", "channel"),
    );
  }

  if (channel && typeof channel !== "string") {
    throw IndiekitError.badRequest(
      __("BadRequestError.invalidValue", "channel"),
    );
  }
}

/**
 * Validate entry/entries parameter
 * @param {(key: string, ...values: Array<string | number>) => string} __ - Localisation function
 * @param {string|Array} [entry] - Entry ID(s) to validate
 * @returns {Array} Array of entry IDs
 * @throws {IndiekitError} If entry is invalid
 */
export function validateEntries(__, entry) {
  if (!entry) {
    throw IndiekitError.badRequest(
      __("BadRequestError.missingParameter", "entry"),
    );
  }

  // Normalize to array
  const entries = Array.isArray(entry) ? entry : [entry];

  if (entries.length === 0) {
    throw IndiekitError.badRequest(
      __("BadRequestError.missingProperty", "entry"),
    );
  }

  return entries;
}

/**
 * Validate channel name
 * @param {(key: string, ...values: Array<string | number>) => string} __ - Localisation function
 * @param {string} name - Channel name to validate
 * @throws {IndiekitError} If name is invalid
 */
export function validateChannelName(__, name) {
  if (!name || typeof name !== "string") {
    throw IndiekitError.badRequest(
      __("BadRequestError.missingParameter", "name"),
    );
  }

  if (name.length > MAX_NAME_LENGTH) {
    throw IndiekitError.badRequest(
      __("microsub.error.nameTooLong", MAX_NAME_LENGTH),
    );
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
  const value = body[parameterName];

  // Direct array
  if (Array.isArray(value)) {
    return value;
  }

  // Single value
  if (value) {
    return [value];
  }

  // Indexed values (param[0], param[1], ...)
  const result = [];
  let index = 0;
  while (body[`${parameterName}[${index}]`] !== undefined) {
    result.push(body[`${parameterName}[${index}]`]);
    index++;
  }

  // Array notation (param[])
  const bracketValues = body[`${parameterName}[]`];
  if (bracketValues) {
    return Array.isArray(bracketValues) ? bracketValues : [bracketValues];
  }

  return result;
}
