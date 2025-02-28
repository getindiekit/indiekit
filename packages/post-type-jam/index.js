import { IndiekitPostTypePlugin } from "@indiekit/plugin";
import { isRequired } from "@indiekit/util";

export default class JamPostTypePlugin extends IndiekitPostTypePlugin {
  name = "Jam post type";

  postType = "jam";

  config = {
    name: "Jam",
    h: "entry",
    discovery: "jam-of",
    fields: {
      "jam-of": { required: true },
      content: {},
      "post-status": {},
      published: { required: true },
    },
  };

  validationSchemas = {
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
      errorMessage: (value, { req }) => req.__(`posts.error.jam.author.empty`),
      exists: { if: (value, { req }) => isRequired(req, "jam-of") },
      notEmpty: true,
    },
  };
}
