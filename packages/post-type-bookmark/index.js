import { isRequired } from "@indiekit/util";

const defaults = {
  name: "Bookmark",
  fields: {
    "bookmark-of": { required: true },
    name: {},
    content: {},
    category: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class BookmarkPostType {
  name = "Bookmark post type";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      discovery: "bookmark-of",
      h: "entry",
      fields: this.options.fields,
    };
  }

  get validationSchemas() {
    return {
      "bookmark-of": {
        errorMessage: (value, { req }) =>
          req.__(`posts.error.url.empty`, "https://example.org"),
        exists: { if: (value, { req }) => isRequired(req, "bookmark-of") },
        isURL: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("bookmark", this);
  }
}
