const defaults = {
  name: "Article",
  fields: {
    name: { required: true },
    summary: {},
    content: { required: true },
    category: {},
    geo: {},
    "post-status": {},
    published: { required: true },
    visibility: {},
  },
};

export default class ArticlePostType {
  constructor(options = {}) {
    this.name = "Article post type";
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
    Indiekit.addPostType("article", this);
  }
}
