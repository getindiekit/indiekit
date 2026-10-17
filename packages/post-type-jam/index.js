import { isRequiredField, localisedMessage } from "@indiekit/util";

const defaults = {
  name: "Jam",
  fields: {
    "jam-of": { required: true },
    content: {},
    "post-status": {},
    published: { required: true },
  },
};

export default class JamPostType {
  name = "Jam post type";

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
      discovery: "jam-of",
      fields: this.options.fields,
    };
  }

  /**
   * @returns {Schema} Validation schemas for fields
   */
  get validationSchemas() {
    return {
      "jam-of.url": {
        errorMessage: localisedMessage(
          "posts.error.url.empty",
          "https://www.youtube.com/watch?v=g5nzLQ63c9E",
        ),
        exists: { if: isRequiredField("jam-of") },
        isURL: true,
      },
      "jam-of.name": {
        errorMessage: localisedMessage("posts.error.jam.name.empty"),
        exists: { if: isRequiredField("jam-of") },
        notEmpty: true,
      },
      "jam-of.author": {
        errorMessage: localisedMessage("posts.error.jam.author.empty"),
        exists: { if: isRequiredField("jam-of") },
        notEmpty: true,
      },
    };
  }

  /**
   * @param {IndiekitInstance} Indiekit - Indiekit instance
   */
  init(Indiekit) {
    Indiekit.addPostType("jam", this);
  }
}

/**
 * @import { Schema } from "express-validator"
 */
