import { IndiekitPostTypePlugin } from "@indiekit/plugin";
import { isRequired } from "@indiekit/util";

export default class LikePostTypePlugin extends IndiekitPostTypePlugin {
  name = "Like post type";

  postType = "like";

  config = {
    name: "Like",
    h: "entry",
    fields: {
      "like-of": { required: true },
      category: {},
      content: {},
      "post-status": {},
      published: { required: true },
      visibility: {},
    },
  };

  validationSchemas = {
    "like-of": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.url.empty`, "https://example.org"),
      exists: { if: (value, { req }) => isRequired(req, "like-of") },
      isURL: true,
    },
  };
}
