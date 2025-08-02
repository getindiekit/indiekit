import { isRequired } from "@indiekit/util";

const defaults = {
  name: "Reply",
  fields: {
    "in-reply-to": { required: true },
    content: { required: true },
    category: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class ReplyPostType {
  name = "Reply post type";

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
      "in-reply-to": {
        errorMessage: (value, { req }) =>
          req.__(`posts.error.url.empty`, "https://example.org"),
        exists: { if: (value, { req }) => isRequired(req, "in-reply-to") },
        isURL: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("reply", this);
  }
}
