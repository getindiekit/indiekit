import cleanStack from "clean-stack";
import { errors } from "./errors.js";

export class IndiekitError extends Error {
  static badRequest(message, options) {
    return new IndiekitError(message, { ...options, code: "bad_request" });
  }

  static forbidden(message, options) {
    return new IndiekitError(message, { ...options, code: "forbidden" });
  }

  static insufficientScope(message, options) {
    return new IndiekitError(message, {
      ...options,
      code: "insufficient_scope",
    });
  }

  static invalidRequest(message, options) {
    return new IndiekitError(message, { ...options, code: "invalid_request" });
  }

  static invalidToken(message, options) {
    return new IndiekitError(message, { ...options, code: "invalid_token" });
  }

  static notFound(message, options) {
    return new IndiekitError(message, { ...options, code: "not_found" });
  }

  static notImplemented(message, options) {
    return new IndiekitError(message, { ...options, code: "not_implemented" });
  }

  static unauthorized(message, options) {
    return new IndiekitError(message, { ...options, code: "unauthorized" });
  }

  static unsupportedMediaType(message, options) {
    return new IndiekitError(message, {
      ...options,
      code: "unsupported_media_type",
    });
  }

  static async fromFetch(response) {
    const body = await response.json();
    const message = body.error_description || response.statusText;
    return new IndiekitError(message, {
      status: response.status,
      code: body.error || response.statusText,
    });
  }

  constructor(message, options = {}) {
    super(message, options);
    this.message = message;
    this.code = options.code || "indiekit";
    this.name = this.getError(this.code)?.name;
    this.status = this.getError(this.code)?.status;

    if (options.scope) {
      this.scope = options.scope;
    }

    if (options.uri) {
      this.uri = options.uri;
    }

    Error.captureStackTrace(this, IndiekitError);
  }

  getError(name) {
    name = name.replace(" ", "_").toLowerCase();
    const error = errors[name];
    error.code = name;

    return error;
  }

  toJSON() {
    return {
      error: this.code,
      error_description: this.message || this.cause.message,
      ...(this.uri && { error_uri: this.uri }),
      ...(this.scope && { scope: this.scope }),
      stack: cleanStack(this.stack),
      cause: this.cause,
    };
  }

  trimStack() {
    Error.captureStackTrace(this, IndiekitError);
    return this;
  }
}
