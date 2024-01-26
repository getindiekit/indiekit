const defaults = {
  name: "Repost",
  fields: {
    "repost-of": { required: true },
    content: {},
    category: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class RepostPostType {
  constructor(options = {}) {
    this.name = "Repost post type";
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
    Indiekit.addPostType("repost", this);
  }
}
