import { IndiekitPostTypePlugin } from "@indiekit/plugin";
import { isRequired } from "@indiekit/util";

export default class RsvpPostTypePlugin extends IndiekitPostTypePlugin {
  name = "RSVP post type";

  postType = "rsvp";

  config = {
    name: "RSVP",
    h: "entry",
    fields: {
      "in-reply-to": { required: true },
      rsvp: { required: true },
      content: {},
      category: {},
      "post-status": {},
      published: { required: true },
      visibility: {},
    },
  };

  validationSchemas = {
    rsvp: {
      errorMessage: (value, { req }) => req.__("posts.error.rsvp.empty"),
      exists: { if: (value, { req }) => isRequired(req, "rsvp") },
      notEmpty: true,
    },
  };
}
