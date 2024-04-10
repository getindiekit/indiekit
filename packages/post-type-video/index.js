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

export default class PhotoPostType {
  constructor(options = {}) {
    this.name = "Video post type";
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
      "video.*": {
        errorMessage: (value, { req }) =>
          req.__(`posts.error.media.empty`, "/movies/video.mp4"),
        exists: { if: (value, { req }) => isRequired(req, "video") },
        notEmpty: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("video", this);
  }
}
