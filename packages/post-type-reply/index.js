import { IndiekitPostTypePlugin } from "@indiekit/plugin";
import { isRequired } from "@indiekit/util";

export default class ReplyPostTypePlugin extends IndiekitPostTypePlugin {
  name = "Reply post type";

  postType = "reply";

  config = {
    name: "Reply",
    h: "entry",
    fields: {
      "in-reply-to": { required: true },
      content: { required: true },
      category: {},
      "post-status": {},
      published: { required: true },
      visibility: {},
    },
  };

  validationSchemas = {
    "in-reply-to": {
      errorMessage: (value, { req }) =>
        req.__(`posts.error.url.empty`, "https://example.org"),
      exists: { if: (value, { req }) => isRequired(req, "in-reply-to") },
      isURL: true,
    },
  };
}
