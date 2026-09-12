import { errors } from "./errors.js";

/**
 * @typedef {object} IndiekitErrorOptions
 * @property {string} [code] - Error code, i.e. `not_found`
 * @property {unknown} [cause] - Error that caused this error
 * @property {string} [plugin] - Name of plug-in, prefixed to the message
 * @property {string} [scope] - Scope required to perform the request
 * @property {number} [status] - HTTP status code
 * @property {string} [uri] - URL of a page describing the error
 */

export class IndiekitError extends Error {
  /**
   * @param {string} message - Error message
   * @param {IndiekitErrorOptions} [options] - Error options
   * @returns {IndiekitError} Bad request error
   */
  static badRequest(message, options) {
    return new IndiekitError(message, { ...options, code: "bad_request" });
  }

  /**
   * @param {string} message - Error message
   * @param {IndiekitErrorOptions} [options] - Error options
   * @returns {IndiekitError} Forbidden error
   */
  static forbidden(message, options) {
    return new IndiekitError(message, { ...options, code: "forbidden" });
  }

  /**
   * @param {string} message - Error message
   * @param {IndiekitErrorOptions} [options] - Error options
   * @returns {IndiekitError} Insufficient scope error
   */
  static insufficientScope(message, options) {
    return new IndiekitError(message, {
      ...options,
      code: "insufficient_scope",
    });
  }

  /**
   * @param {string} message - Error message
   * @param {IndiekitErrorOptions} [options] - Error options
   * @returns {IndiekitError} Invalid request error
   */
  static invalidRequest(message, options) {
    return new IndiekitError(message, { ...options, code: "invalid_request" });
  }

  /**
   * @param {string} message - Error message
   * @param {IndiekitErrorOptions} [options] - Error options
   * @returns {IndiekitError} Not found error
   */
  static notFound(message, options) {
    return new IndiekitError(message, { ...options, code: "not_found" });
  }

  /**
   * @param {string} message - Error message
   * @param {IndiekitErrorOptions} [options] - Error options
   * @returns {IndiekitError} Not implemented error
   */
  static notImplemented(message, options) {
    return new IndiekitError(message, { ...options, code: "not_implemented" });
  }

  /**
   * @param {string} message - Error message
   * @param {IndiekitErrorOptions} [options] - Error options
   * @returns {IndiekitError} Unauthorized error
   */
  static unauthorized(message, options) {
    return new IndiekitError(message, { ...options, code: "unauthorized" });
  }

  /**
   * @param {string} message - Error message
   * @param {IndiekitErrorOptions} [options] - Error options
   * @returns {IndiekitError} Unsupported media type error
   */
  static unsupportedMediaType(message, options) {
    return new IndiekitError(message, {
      ...options,
      code: "unsupported_media_type",
    });
  }

  /**
   * Create an error from an unsuccessful fetch response
   * @param {Response} response - Fetch response
   * @returns {Promise<IndiekitError>} Indiekit error
   */
  static async fromFetch(response) {
    let body;
    let message = response.statusText;

    try {
      // Parse JSON response, if provided
      body = await response.json();
      message = body.error_description || response.statusText;
    } catch (error) {
      console.error(error);
    }

    return new IndiekitError(message, {
      status: response.status,
      code: body?.error || response.statusText,
      cause: body?.cause,
    });
  }

  /**
   * Get status and name for a given error code
   * @param {string} [name] - Error code or name
   * @returns {{ code: string, name: string, status: number }|undefined} Error values
   */
  static getError(name) {
    const code = String(name || "unknown")
      .replaceAll(" ", "_")
      .toLowerCase();
    const error = errors[code];

    if (!error) return;

    return { ...error, code };
  }

  /**
   * @param {string} message - Error message
   * @param {IndiekitErrorOptions} [options] - Error options
   */
  constructor(message, options = {}) {
    super(message, options);
    this.message = options.plugin ? `${options.plugin}: ${message}` : message;
    this.code = options.code || "indiekit";
    this.name = IndiekitError.getError(this.code)?.name || this.name;
    this.status =
      options.status || IndiekitError.getError(this.code)?.status || 500;

    if (options.scope) {
      this.scope = options.scope;
    }

    if (options.uri) {
      this.uri = options.uri;
    }
  }
}
