import { isRequired } from "@indiekit/util";

const defaults = {
  name: "Like",
  fields: {
    "like-of": { required: true },
    category: {},
    content: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class LikePostType {
  name = "Like post type";

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
      "like-of": {
        errorMessage: /** @type {FieldMessageFactory} */ (
          (value, { req }) =>
            req.__(`posts.error.url.empty`, "https://example.org")
        ),
        exists: {
          if: /** @type {CustomValidator} */ (
            (value, { req }) => isRequired(req, "like-of")
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
    Indiekit.addPostType("like", this);
  }
}

/**
 * @import { CustomValidator, FieldMessageFactory, Schema } from "express-validator"
 */
