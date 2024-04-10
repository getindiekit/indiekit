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
  constructor(options = {}) {
    this.name = "Photo post type";
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      h: "entry",
      fields: this.options.fields,
    };
  }

  get validationSchemas() {
    return {
      "photo.*.url": {
        errorMessage: (value, { req }) =>
          req.__(`posts.error.media.empty`, "/photos/image.jpg"),
        exists: { if: (value, { req }) => isRequired(req, "photo") },
        notEmpty: true,
      },
      "photo.*.alt": {
        errorMessage: (value, { req }) =>
          req.__(`posts.error.mp-photo-alt.empty`),
        exists: { if: (value, { req }) => isRequired(req, "mp-photo-alt") },
        notEmpty: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("photo", this);
  }
}
