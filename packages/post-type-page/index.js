const defaults = {
  name: "Page",
  fields: {
    name: { required: true },
    content: { required: true },
    summary: {},
    category: {},
    "post-status": {},
    visibility: {},
  },
};

export default class PagePostType {
  name = "Page post type";

  constructor(options = {}) {
    this.options = { ...defaults, ...options };
  }

  get config() {
    return {
      name: this.options.name,
      h: "page",
      fields: this.options.fields,
    };
  }

  init(Indiekit) {
    Indiekit.addPostType("page", this);
  }
}
