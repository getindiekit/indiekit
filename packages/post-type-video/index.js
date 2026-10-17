import { isRequired } from "@indiekit/util";

const defaults = {
  name: "Video",
  fields: {
    video: { required: true },
    content: {},
    category: {},
    geo: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class VideoPostType {
  name = "Video post type";

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
      "video.*": {
        errorMessage: /** @type {FieldMessageFactory} */ (
          (value, { req }) =>
            req.__(`posts.error.media.empty`, "/movies/video.mp4")
        ),
        exists: {
          if: /** @type {CustomValidator} */ (
            (value, { req }) => isRequired(req, "video")
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
    Indiekit.addPostType("video", this);
  }
}

/**
 * @import { CustomValidator, FieldMessageFactory, Schema } from "express-validator"
 */
