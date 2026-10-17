import { isRequired } from "@indiekit/util";

const defaults = {
  name: "Reply",
  fields: {
    "in-reply-to": { required: true },
    content: { required: true },
    category: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class ReplyPostType {
  name = "Reply post type";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  /**
   * @returns {Partial<IndiekitPostType>} Post type config
   */
  get config() {
    return {
      name: this.options.name,
      h: "entry",
      fields: this.options.fields,
    };
  }

  /**
   * @returns {Schema} Validation schemas for fields
   */
  get validationSchemas() {
    return {
      "in-reply-to": {
        errorMessage: /** @type {FieldMessageFactory} */ (
          (value, { req }) =>
            req.__(`posts.error.url.empty`, "https://example.org")
        ),
        exists: {
          if: /** @type {CustomValidator} */ (
            (value, { req }) => isRequired(req, "in-reply-to")
          ),
        },
        isURL: true,
      },
    };
  }

  /**
   * @param {IndiekitInstance} Indiekit - Indiekit instance
   */
  init(Indiekit) {
    Indiekit.addPostType("reply", this);
  }
}

/**
 * @import { CustomValidator, FieldMessageFactory, Schema } from "express-validator"
 */
