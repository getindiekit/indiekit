import cleanStack from "clean-stack";
import { errors } from "./errors.js";

export class IndiekitError extends Error {
  static badRequest(message) {
    return new IndiekitError(message, { code: "bad_request" });
  }

  static forbidden(message) {
    return new IndiekitError(message, { code: "forbidden" });
  }

  static insufficientScope(message, { scope }) {
    return new IndiekitError(message, { code: "insufficient_scope", scope });
  }

  static invalidRequest(message) {
    return new IndiekitError(message, { code: "invalid_request" });
  }

  static invalidToken(message) {
    return new IndiekitError(message, { code: "invalid_token" });
  }

  static notFound(message) {
    return new IndiekitError(message, { code: "not_found" });
  }

  static notImplemented(message) {
    return new IndiekitError(message, { code: "not_implemented" });
  }

  static unauthorized(message) {
    return new IndiekitError(message, { code: "unauthorized" });
  }

  static unsupportedMediaType(message) {
    return new IndiekitError(message, { code: "unsupported_media_type" });
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
