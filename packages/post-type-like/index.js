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

  get config() {
    return {
      name: this.options.name,
      h: "entry",
      fields: this.options.fields,
    };
  }

  get validationSchemas() {
    return {
      "like-of": {
        errorMessage: (value, { req }) =>
          req.__(`posts.error.url.empty`, "https://example.org"),
        exists: { if: (value, { req }) => isRequired(req, "like-of") },
        isURL: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("like", this);
  }
}
