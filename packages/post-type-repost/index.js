import { IndiekitPostTypePlugin } from "@indiekit/plugin";
import { isRequired } from "@indiekit/util";

export default class RepostPostTypePlugin extends IndiekitPostTypePlugin {
  name = "Repost post type";

  postType = "repost";

  config = {
    name: "Repost",
    h: "entry",
    fields: {
      "repost-of": { required: true },
      content: {},
      category: {},
      "post-status": {},
      published: { required: true },
      visibility: {},
    },
  };

  validationSchemas = {
    "repost-of": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.url.empty`, "https://example.org"),
      exists: { if: (value, { req }) => isRequired(req, "repost-of") },
      isURL: true,
    },
  };
}
