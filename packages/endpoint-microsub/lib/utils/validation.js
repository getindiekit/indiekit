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
 * @param {i18n.__} __ - Localisation function
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
 *
 * Asserts `channel` is a string, so only skip `isRequired` where a missing
 * channel isn’t then used as one
 * @param {i18n.__} __ - Localisation function
 * @param {unknown} [channel] - Channel UID to validate
 * @param {boolean} [isRequired] - Whether channel is required
 * @returns {asserts channel is string} Channel UID is a string
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
 * @param {i18n.__} __ - Localisation function
 * @param {unknown} [entry] - Entry ID(s) to validate
 * @returns {unknown[]} Array of entry IDs
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
 * @param {i18n.__} __ - Localisation function
 * @param {unknown} name - Channel name to validate
 * @returns {asserts name is string} Channel name is a string
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
      __("microsub.error.nameTooLong", String(MAX_NAME_LENGTH)),
    );
  }
}

/**
 * Parse array parameter from request
 * Handles both array[] and array[0], array[1] formats
 * @param {Record<string, unknown>} body - Request body
 * @param {string} parameterName - Parameter name
 * @returns {unknown[]} Parsed array
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
  /**
   * @type {unknown[]}
   */
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

/**
 * @import i18n from "i18n"
 */
