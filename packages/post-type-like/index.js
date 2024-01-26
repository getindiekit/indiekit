const defaults = {
  name: "Like",
  fields: {
    "like-of": { required: true },
    category: {},
    content: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class LikePostType {
  constructor(options = {}) {
    this.name = "Like post type";
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
    Indiekit.addPostType("like", this);
  }
}
