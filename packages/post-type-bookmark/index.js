import { IndiekitPostTypePlugin } from "@indiekit/plugin";
import { isRequired } from "@indiekit/util";

export default class BookmarkPostTypePlugin extends IndiekitPostTypePlugin {
  name = "Bookmark post type";

  postType = "bookmark";

  config = {
    name: "Bookmark",
    discovery: "bookmark-of",
    h: "entry",
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

  validationSchemas = {
    "bookmark-of": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.url.empty`, "https://example.org"),
      exists: { if: (value, { req }) => isRequired(req, "bookmark-of") },
      isURL: true,
    },
  };
}
