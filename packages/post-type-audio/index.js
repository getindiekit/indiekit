import { isRequired } from "@indiekit/util";

const defaults = {
  name: "Audio",
  fields: {
    audio: { required: true },
    content: {},
    category: {},
    geo: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class AudioPostType {
  name = "Audio post type";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  /**
   * @returns {Partial<IndiekitPostType>} Post type config
   */
  get config() {
    return {
      name: this.options.name,
      discovery: "audio",
      h: "entry",
      fields: this.options.fields,
    };
  }

  /**
   * @returns {Schema} Validation schemas for fields
   */
  get validationSchemas() {
    return {
      "audio.*": {
        errorMessage: /** @type {FieldMessageFactory} */ (
          (value, { req }) =>
            req.__(`posts.error.media.empty`, "/music/audio.mp3")
        ),
        exists: {
          if: /** @type {CustomValidator} */ (
            (value, { req }) => isRequired(req, "audio")
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
    Indiekit.addPostType("audio", this);
  }
}

/**
 * @import { CustomValidator, FieldMessageFactory, Schema } from "express-validator"
 */
