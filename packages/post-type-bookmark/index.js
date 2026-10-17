import { isRequired } from "@indiekit/util";

const defaults = {
  name: "Bookmark",
  fields: {
    "bookmark-of": { required: true },
    name: {},
    content: {},
    category: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class BookmarkPostType {
  name = "Bookmark post type";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  /**
   * @returns {Partial<IndiekitPostType>} Post type config
   */
  get config() {
    return {
      name: this.options.name,
      discovery: "bookmark-of",
      h: "entry",
      fields: this.options.fields,
    };
  }

  /**
   * @returns {Schema} Validation schemas for fields
   */
  get validationSchemas() {
    return {
      "bookmark-of": {
        errorMessage: /** @type {FieldMessageFactory} */ (
          (value, { req }) =>
            req.__(`posts.error.url.empty`, "https://example.org")
        ),
        exists: {
          if: /** @type {CustomValidator} */ (
            (value, { req }) => isRequired(req, "bookmark-of")
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
    Indiekit.addPostType("bookmark", this);
  }
}

/**
 * @import { CustomValidator, FieldMessageFactory, Schema } from "express-validator"
 */
