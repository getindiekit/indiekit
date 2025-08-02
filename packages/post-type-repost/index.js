import { isRequired } from "@indiekit/util";

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

  get config() {
    return {
      name: this.options.name,
      h: "entry",
      fields: this.options.fields,
    };
  }

  get validationSchemas() {
    return {
      "repost-of": {
        errorMessage: (value, { req }) =>
          req.__(`posts.error.url.empty`, "https://example.org"),
        exists: { if: (value, { req }) => isRequired(req, "repost-of") },
        isURL: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("repost", this);
  }
}
