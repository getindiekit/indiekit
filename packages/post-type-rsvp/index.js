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
  constructor(options = {}) {
    this.name = "RSVP post type";
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      h: "entry",
      fields: this.options.fields,
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("rsvp", this);
  }
}
