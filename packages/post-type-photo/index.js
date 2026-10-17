import { isRequired } from "@indiekit/util";

const defaults = {
  name: "Photo",
  fields: {
    photo: { required: true },
    content: {},
    category: {},
    geo: {},
    "post-status": {},
    "mp-photo-alt": { required: true },
    published: { required: true },
    visibility: {},
  },
};

export default class PhotoPostType {
  name = "Photo post type";

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
      "photo.*.url": {
        errorMessage: /** @type {FieldMessageFactory} */ (
          (value, { req }) =>
            req.__(`posts.error.media.empty`, "/photos/image.jpg")
        ),
        exists: {
          if: /** @type {CustomValidator} */ (
            (value, { req }) => isRequired(req, "photo")
          ),
        },
        notEmpty: true,
      },
      "photo.*.alt": {
        errorMessage: /** @type {FieldMessageFactory} */ (
          (value, { req }) => req.__(`posts.error.mp-photo-alt.empty`)
        ),
        exists: {
          if: /** @type {CustomValidator} */ (
            (value, { req }) => isRequired(req, "mp-photo-alt")
          ),
        },
        notEmpty: true,
      },
    };
  }

  /**
   * @param {IndiekitInstance} Indiekit - Indiekit instance
   */
  init(Indiekit) {
    Indiekit.addPostType("photo", this);
  }
}

/**
 * @import { CustomValidator, FieldMessageFactory, Schema } from "express-validator"
 */
