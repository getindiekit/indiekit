import { isRequired } from "@indiekit/util";

const defaults = {
  name: "Event",
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

export default class EventPostType {
  constructor(options = {}) {
    this.name = "Event post type";
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      h: "event",
      fields: this.options.fields,
    };
  }

  get validationSchemas() {
    return {
      start: {
        errorMessage: (value, { req }) => req.__("posts.error.start.empty"),
        exists: { if: (value, { req }) => isRequired(req, "start") },
        notEmpty: true,
      },
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("event", this);
  }
}
