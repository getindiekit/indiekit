const defaults = {
  name: "Reply",
  fields: {
    "in-reply-to": { required: true },
    content: { required: true },
    category: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class ReplyPostType {
  constructor(options = {}) {
    this.name = "Reply post type";
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
    Indiekit.addPostType("reply", this);
  }
}
