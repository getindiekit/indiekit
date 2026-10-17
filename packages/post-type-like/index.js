import { isRequiredField, localisedMessage } from "@indiekit/util";

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
        errorMessage: localisedMessage(
          "posts.error.url.empty",
          "https://example.org",
        ),
        exists: { if: isRequiredField("like-of") },
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
 * @import { Schema } from "express-validator"
 */
