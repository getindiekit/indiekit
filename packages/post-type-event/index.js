import { IndiekitPostTypePlugin } from "@indiekit/plugin";
import { isRequired } from "@indiekit/util";

export default class EventPostTypePlugin extends IndiekitPostTypePlugin {
  name = "Event post type";

  postType = "event";

  config = {
    name: "Event",
    h: "event",
    fields: {
      name: { required: true },
      start: { required: true },
      end: {},
      url: {},
      location: {},
      content: {},
      category: {},
      "post-status": {},
      published: { required: true },
      visibility: {},
    },
  };

  validationSchemas = {
    start: {
      errorMessage: (value, { req }) => req.__("posts.error.start.empty"),
      exists: { if: (value, { req }) => isRequired(req, "start") },
      notEmpty: true,
    },
  };
}
