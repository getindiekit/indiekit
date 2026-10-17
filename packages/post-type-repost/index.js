import { isRequiredField, localisedMessage } from "@indiekit/util";

const defaults = {
  name: "Repost",
  fields: {
    "repost-of": { required: true },
    content: {},
    category: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class RepostPostType {
  name = "Repost post type";

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
      "repost-of": {
        errorMessage: localisedMessage(
          "posts.error.url.empty",
          "https://example.org",
        ),
        exists: { if: isRequiredField("repost-of") },
        isURL: true,
      },
    };
  }

  /**
   * @param {IndiekitInstance} Indiekit - Indiekit instance
   */
  init(Indiekit) {
    Indiekit.addPostType("repost", this);
  }
}

/**
 * @import { Schema } from "express-validator"
 */
