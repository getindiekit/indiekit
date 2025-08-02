import { isRequired } from "@indiekit/util";

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

  get config() {
    return {
      name: this.options.name,
      h: "entry",
      discovery: "jam-of",
      fields: this.options.fields,
    };
  }

  get validationSchemas() {
    return {
      "jam-of.url": {
        errorMessage: (value, { req }) =>
          req.__(
            `posts.error.url.empty`,
            "https://www.youtube.com/watch?v=g5nzLQ63c9E",
          ),
        exists: { if: (value, { req }) => isRequired(req, "jam-of") },
        isURL: true,
      },
      "jam-of.name": {
        errorMessage: (value, { req }) => req.__(`posts.error.jam.name.empty`),
        exists: { if: (value, { req }) => isRequired(req, "jam-of") },
        notEmpty: true,
      },
      "jam-of.author": {
        errorMessage: (value, { req }) =>
          req.__(`posts.error.jam.author.empty`),
        exists: { if: (value, { req }) => isRequired(req, "jam-of") },
        notEmpty: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("jam", this);
  }
}
