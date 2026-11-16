import { isRequiredField, localisedMessage } from "@indiekit/util";

const defaults = {
  name: "RSVP",
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

export default class RsvpPostType {
  name = "RSVP post type";

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
      rsvp: {
        errorMessage: localisedMessage("posts.error.rsvp.empty"),
        exists: { if: isRequiredField("rsvp") },
        notEmpty: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("rsvp", this);
  }
}
